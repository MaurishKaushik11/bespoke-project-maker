// Vercel serverless function for MERN Stack Event Management
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your models
import Profile from '../backend/models/Profile.js';
import Event from '../backend/models/Event.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const allowedOrigins = [
      'https://bespoke-project-maker.vercel.app',
      'http://localhost:8080',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
      maxPoolSize: 1,
    });
    cachedDb = connection;
    console.log('✅ Connected to MongoDB');
    return cachedDb;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Management API is running' });
});

// Profile routes
app.get('/api/profiles', async (req, res) => {
  try {
    await connectToDatabase();
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/profiles', async (req, res) => {
  try {
    await connectToDatabase();
    const profile = new Profile(req.body);
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/profiles/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/profiles/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/profiles/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const profile = await Profile.findByIdAndDelete(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Event routes
app.get('/api/events', async (req, res) => {
  try {
    await connectToDatabase();
    const events = await Event.find()
      .populate('profileIds', 'name timezone')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    await connectToDatabase();
    const profiles = await Profile.find({ _id: { $in: req.body.profileIds } });
    if (profiles.length !== req.body.profileIds.length) {
      return res.status(400).json({ message: 'One or more profiles not found' });
    }

    const event = new Event({
      title: req.body.title,
      description: req.body.description,
      profileIds: req.body.profileIds,
      timezone: req.body.timezone,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      createdBy: req.body.createdBy,
    });

    const newEvent = await event.save();
    const populatedEvent = await Event.findById(newEvent._id)
      .populate('profileIds', 'name timezone');

    res.status(201).json(populatedEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const event = await Event.findById(req.params.id)
      .populate('profileIds', 'name timezone');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('profileIds', 'name timezone');

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await connectToDatabase();
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: error.message });
  }
});

// Vercel serverless function export
export default app;
