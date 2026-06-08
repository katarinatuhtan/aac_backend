const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const transporter = require('../helpers/mailer');
const generateConfirmationPdf = require('../helpers/generateConfirmationPdf');

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


// CONFIRM — slanje potvrda svim prijavljenim
router.post('/:id/confirm', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!event.registeredUsers || event.registeredUsers.length === 0) {
      return res.status(400).json({ message: 'Nema prijavljenih korisnika.' });
    }

    const results = [];

    for (const user of event.registeredUsers) {
      try {
        const pdfBuffer = await generateConfirmationPdf(user, event);

        await transporter.sendMail({
          from: `"AAC Sustav" <${process.env.MAIL_USER}>`,
          to: user.email,
          subject: `Potvrda sudjelovanja – ${event.name}`,
          html: `
            <p>Poštovani/a ${user.name} ${user.last_name},</p>
            <p>U privitku se nalazi vaša potvrda sudjelovanja za događaj <strong>${event.name}</strong>.</p>
            <br>
            <p>AAC Sustav</p>
          `,
          attachments: [
            {
              filename: `potvrda_${event.name.replace(/\s+/g, '_')}_${user.last_name}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf'
            }
          ]
        });

        results.push({ user: user.email, status: 'sent' });
      } catch (err) {
        results.push({ user: user.email, status: 'failed', error: err.message });
      }
    }

    res.json({ message: 'Potvrde poslane.', results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;