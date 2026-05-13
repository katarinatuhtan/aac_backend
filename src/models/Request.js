const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    default: 'zaprimljeno'
  }
//   user_id: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
}, {
  timestamps: true
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;