const mongoose = require('mongoose');

   const eventSchema = new mongoose.Schema({
     title: { type: String, required: true },
     date: { type: Date, required: true },
     startTime: { type: String, required: true },
     location: { type: String, required: true },
     description: String,
     category: String,
     duration: { type: Number, default: 2 },
     donationInstructions: {
       whatToDonate: [String],
       howToDonate: String
     },
     image: { type: String, default: '/images/placeholder.jpg' }
   });

   module.exports = mongoose.model('Event', eventSchema);