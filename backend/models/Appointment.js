const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' },
  vetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
