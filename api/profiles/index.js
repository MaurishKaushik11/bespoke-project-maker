import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

// GET all profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: -1 });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single profile
router.get('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE profile
router.post('/', async (req, res) => {
  const profile = new Profile({
    name: req.body.name,
    timezone: req.body.timezone || 'America/New_York',
  });

  try {
    const newProfile = await profile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE profile
router.put('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (req.body.name) profile.name = req.body.name;
    if (req.body.timezone) profile.timezone = req.body.timezone;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE profile (bonus - not required by assignment but useful)
router.delete('/:id', async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    await Profile.findByIdAndDelete(req.params.id);
    res.json({ message: 'Profile deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
