const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');

router.post('/register', async (req, res) => {
  try {
    const { name, email, eventId } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ name, email, registeredEvents: [eventId] });
    } else {
      if (!user.registeredEvents.includes(eventId)) {
        user.registeredEvents.push(eventId);
      }
    }
    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id/events', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('registeredEvents');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.registeredEvents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;