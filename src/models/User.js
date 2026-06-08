const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    unique: true,
    minlength: 3
  },
  name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  organization: {
    type: String,
    trim: true,
    enum: ['UNIRI','APURI', 'EFRI', 'FABRI', 'FDMRI', 'FIDIT', 'FIZRI', 'FMRI', 'FZSRI', 'FFRI', 'GRADRI', 'MEDRI','PFRI', 'PRAVRI', 'RITEH', 'UFRI'], 
  },
  role: {
    type: String,
    enum: ['Student', 'Admin', 'Gost', 'Profesor'],
  },
  allergies: {
    type: String,
  },
  password: {
    type: String,
    minlength: 6
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Method to verify password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;