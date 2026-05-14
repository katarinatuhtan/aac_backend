require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
const certificateRoutes = require('./routes/certificates');
const contentRoutes = require('./routes/contents');
const eventRoutes = require('./routes/events');
const requestRoutes = require('./routes/requests');
const userRoutes = require('./routes/users');

app.use('/api/certificates', certificateRoutes);
app.use('/api/contents', contentRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);

// DB CONNECTION
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✓ Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
} else {
    console.log('MONGODB_URI nije postavljen u .env');
}

// TEST ROUTE
app.get('/', (req, res) => {
    res.send('Hello from Express + MongoDB!');
});

// START SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});