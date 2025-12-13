const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  time: { type: String, required: true },
  note: { type: String }, // Optional note from user
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  vetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // no longer required
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
