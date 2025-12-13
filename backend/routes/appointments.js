const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const authMiddleware = require('../middleware/authMiddleware');

// Create appointment (Owner)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { date, time, note, petId } = req.body;

    const appointment = new Appointment({
      date,
      time,
      note,
      petId,
      ownerId: req.user.id
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ message: 'Failed to create appointment' });
  }
});

// Get appointments (Admin or Owner)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'owner') filter.ownerId = req.user.id;
    if (req.user.role === 'vet') filter.vetId = req.user.id;

    const appointments = await Appointment.find(filter)
      .populate('petId', 'name')
      .populate('ownerId', 'name email')
      .populate('vetId', 'name')
      .sort({ date: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch appointments' });
  }
});

// Admin approve / cancel / complete operations
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, vetId: req.user.id },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update appointment' });
  }
});

module.exports = router;
