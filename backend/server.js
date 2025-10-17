import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import profileRoutes from './routes/profiles.js';
import eventRoutes from './routes/events.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);

    // Allow specific origins for production
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

// Routes
app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Event Management API is running' });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  // Start server after successful DB connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('🔄 Starting server without database connection...');
  // Start server even if DB connection fails
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (No database connection)`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
    console.log('⚠️  Database features will not work until MongoDB connection is established');
  });
});
