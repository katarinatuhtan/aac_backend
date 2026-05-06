const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;