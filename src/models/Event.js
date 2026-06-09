const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  catering: {
    type: Boolean,
    default: false
  },
  collaborators: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    min: 0
  }, 
  status: {
    type: String,
    enum: ['active', 'finished'],
    default: 'active'
  },
  registeredUsers: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      last_name: { type: String, required: true },
      email: { type: String, required: true },
      allergies: { type: String, default: '' }
    }
  ],
  collaboratorsList: [
    {
      _id: { type: String, required: true },
      name: { type: String, required: true },
      last_name: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;