const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'u_obradi'
  }
}, {
  timestamps: true
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;