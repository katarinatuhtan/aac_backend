const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  attendance: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Registration = mongoose.model('Registration', registrationSchema);

module.exports = Registration;