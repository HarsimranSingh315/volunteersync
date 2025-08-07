const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});
module.exports = mongoose.model('User', UserSchema);