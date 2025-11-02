const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Veterinerleri listeleme
router.get('/', async (req, res) => {
  try {
    const vets = await User.find({ role: 'vet' });
    res.json(vets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Veteriner ekleme (admin için örnek)
router.post('/', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const vet = new User({ name, email, password, role: 'vet' });
    await vet.save();
    res.status(201).json(vet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
// Belirli bir veterinere ait randevular
router.get('/vet/:vetId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ vetId: req.params.vetId })
      .populate('vetId')
      .populate('petId');
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Belirli bir hayvan sahibine ait randevular
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ ownerId: req.params.ownerId })
      .populate('vetId')
      .populate('petId');
    res.json(appointments);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
