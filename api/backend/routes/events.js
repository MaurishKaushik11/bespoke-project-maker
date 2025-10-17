import express from 'express';
import Event from '../models/Event.js';
import Profile from '../models/Profile.js';

const router = express.Router();

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find()
      .populate('profileIds', 'name timezone')
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET events for specific profile
router.get('/profile/:profileId', async (req, res) => {
  try {
    const events = await Event.find({
      profileIds: req.params.profileId
    })
      .populate('profileIds', 'name timezone')
      .sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE event
router.post('/', async (req, res) => {
  try {
    // Validate that profiles exist
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

    // Populate the response
    const populatedEvent = await Event.findById(newEvent._id)
      .populate('profileIds', 'name timezone');

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Log changes for update tracking
    const changes = [];
    const updatedBy = req.body.updatedBy || 'system';

    // Track specific field changes
    if (req.body.title !== undefined && req.body.title !== event.title) {
      changes.push({
        field: 'title',
        oldValue: event.title,
        newValue: req.body.title,
        updatedBy,
      });
    }

    if (req.body.description !== undefined && req.body.description !== event.description) {
      changes.push({
        field: 'description',
        oldValue: event.description,
        newValue: req.body.description,
        updatedBy,
      });
    }

    if (req.body.timezone !== undefined && req.body.timezone !== event.timezone) {
      changes.push({
        field: 'timezone',
        oldValue: event.timezone,
        newValue: req.body.timezone,
        updatedBy,
      });
    }

    if (req.body.startDate !== undefined) {
      const newStartDate = new Date(req.body.startDate);
      if (newStartDate.getTime() !== event.startDate.getTime()) {
        changes.push({
          field: 'startDate',
          oldValue: event.startDate,
          newValue: newStartDate,
          updatedBy,
        });
      }
    }

    if (req.body.endDate !== undefined) {
      const newEndDate = new Date(req.body.endDate);
      if (newEndDate.getTime() !== event.endDate.getTime()) {
        changes.push({
          field: 'endDate',
          oldValue: event.endDate,
          newValue: newEndDate,
          updatedBy,
        });
      }
    }

    // Update event fields
    if (req.body.title !== undefined) event.title = req.body.title;
    if (req.body.description !== undefined) event.description = req.body.description;
    if (req.body.timezone !== undefined) event.timezone = req.body.timezone;
    if (req.body.startDate !== undefined) event.startDate = new Date(req.body.startDate);
    if (req.body.endDate !== undefined) event.endDate = new Date(req.body.endDate);

    // Add update logs if there are changes
    if (changes.length > 0) {
      event.updateLogs = [...event.updateLogs, ...changes];
    }

    const updatedEvent = await event.save();

    // Populate the response
    const populatedEvent = await Event.findById(updatedEvent._id)
      .populate('profileIds', 'name timezone');

    res.json(populatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET event update logs
router.get('/:id/logs', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event.updateLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
