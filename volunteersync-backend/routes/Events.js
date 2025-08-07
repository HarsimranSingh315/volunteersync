const express = require('express');
   const router = express.Router();
   const Event = require('../models/Event');
   const User = require('../models/User');

   router.get('/', async (req, res) => {
     try {
       const events = await Event.find();
       const eventsWithCount = await Promise.all(events.map(async (event) => {
         const count = await User.countDocuments({ registeredEvents: event._id });
         return { ...event._doc, registrationCount: count };
       }));
       res.json(eventsWithCount);
     } catch (err) {
       res.status(500).json({ message: err.message });
     }
   });

   router.get('/:id', async (req, res) => {
     try {
       const event = await Event.findById(req.params.id);
       if (!event) return res.status(404).json({ message: 'Event not found' });
       const count = await User.countDocuments({ registeredEvents: event._id });
       res.json({ ...event._doc, registrationCount: count });
     } catch (err) {
       res.status(500).json({ message: err.message });
     }
   });

   module.exports = router;