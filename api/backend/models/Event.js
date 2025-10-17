import mongoose from 'mongoose';

const eventUpdateLogSchema = new mongoose.Schema({
  field: {
    type: String,
    required: true,
  },
  oldValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  newValue: {
    type: mongoose.Schema.Types.Mixed,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String, // Could be profile ID or user identifier
  },
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  profileIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  }],
  timezone: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
  updateLogs: [eventUpdateLogSchema],
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for better query performance
eventSchema.index({ profileIds: 1, startDate: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });

export default mongoose.model('Event', eventSchema);
