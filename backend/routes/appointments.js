const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Randevu oluşturma
router.post('/', async (req, res) => {
  try {
    const { date, time, vetId, petId } = req.body;
    const appointment = new Appointment({ date, time, vetId, petId });
    await appointment.save();
    res.status(201).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Randevuları listeleme
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find().populate('vetId').populate('petId');
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
