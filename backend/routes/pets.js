const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const authMiddleware = require('../middleware/authMiddleware');

// Debug endpoint - auth test
router.get('/test', authMiddleware, async (req, res) => {
  res.json({ 
    message: 'Auth working', 
    user: { 
      id: req.user.id, 
      role: req.user.role 
    } 
  });
});

// List all pets (for admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};
    // If owner, show only their own pets
    if (req.user.role === 'owner') {
      filter.ownerId = req.user.id;
    }
    const pets = await Pet.find(filter).populate('ownerId', 'name email');
    res.json(pets);
  } catch (err) {
    console.error('Pet listing error:', err);
    res.status(400).json({ error: err.message });
  }
});

// List user's pets
router.get('/owner/:ownerId', authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({ ownerId: req.params.ownerId });
    res.json(pets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a single pet
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('ownerId', 'name email');
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Only owner can view their own pet (except admin)
    if (req.user.role === 'owner' && pet.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a pet
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, species, age } = req.body;
    
    // Validation
    if (!name || !species || !age) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (age < 0 || age > 50) {
      return res.status(400).json({ error: 'Please enter a valid age (0-50)' });
    }
    
    const pet = new Pet({ 
      name, 
      species, 
      age, 
      ownerId: req.user.id // User ID from token
    });
    
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a pet
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, species, age } = req.body;
    
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Only owner can update their own pet
    if (req.user.role === 'owner' && pet.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    
    // Validation
    if (age && (age < 0 || age > 50)) {
      return res.status(400).json({ error: 'Please enter a valid age (0-50)' });
    }
    
    // Update
    if (name) pet.name = name;
    if (species) pet.species = species;
    if (age) pet.age = age;
    
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a pet
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }
    
    // Only owner can delete their own pet (admin can also delete)
    if (req.user.role === 'owner' && pet.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
