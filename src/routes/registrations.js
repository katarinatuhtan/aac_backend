const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');

// CREATE
router.post('/', async (req, res) => {
    try {
        const reg = new Registration(req.body);
        await reg.save();
        res.status(201).json(reg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// READ ALL
router.get('/', async (req, res) => {
    try {
        const regs = await Registration.find();
        res.json(regs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// READ ONE
router.get('/:id', async (req, res) => {
    try {
        const reg = await Registration.findById(req.params.id);
        if (!reg) return res.status(404).json({ message: 'Registration not found' });
        res.json(reg);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// UPDATE
router.put('/:id', async (req, res) => {
    try {
        const reg = await Registration.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!reg) return res.status(404).json({ message: 'Registration not found' });
        res.json(reg);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const reg = await Registration.findByIdAndDelete(req.params.id);
        if (!reg) return res.status(404).json({ message: 'Registration not found' });
        res.json({ message: 'Registration deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;