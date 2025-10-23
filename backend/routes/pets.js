const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const User = require('../models/User');

// Evcil hayvan ekleme
router.post('/', async (req, res) => {
  try {
    const { name, species, age, ownerId } = req.body;
    const pet = new Pet({ name, species, age, ownerId });
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Kullanıcının hayvanlarını listeleme
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const pets = await Pet.find({ ownerId: req.params.ownerId });
    res.json(pets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
