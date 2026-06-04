const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// CREATE
router.post('/', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json(event);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// REGISTER
router.post('/:id/register', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const { _id, name, last_name, email } = req.body;

        const alreadyRegistered = event.registeredUsers.some(u => u._id === _id);
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'User already registered' });
        }

        if (event.registeredUsers.length >= event.capacity) {
            return res.status(400).json({ message: 'Event is full' });
        }

        event.registeredUsers.push({ _id, name, last_name, email });
        await event.save();

        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UNREGISTER
router.delete('/:id/register/:userId', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        event.registeredUsers = event.registeredUsers.filter(
            u => u._id !== req.params.userId
        );

        await event.save();
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;