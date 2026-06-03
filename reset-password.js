require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const EMAIL = process.argv[2];
const NOVA_LOZINKA = process.argv[3];

if (!EMAIL || !NOVA_LOZINKA) {
  console.log('Upotreba: node reset-password.js <email> <nova-lozinka>');
  process.exit(1);
}

async function resetLozinke() {
  await mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findOne({ email: EMAIL.toLowerCase() });
  if (!user) {
    console.log('Korisnik nije pronađen za email:', EMAIL);
    process.exit(1);
  }

  const hash = await bcrypt.hash(NOVA_LOZINKA, 12);
  await User.findByIdAndUpdate(user._id, { password: hash });

  console.log('Lozinka uspješno resetirana za:', EMAIL);
  process.exit(0);
}

resetLozinke().catch(err => {
  console.error('Greška:', err.message);
  process.exit(1);
});
