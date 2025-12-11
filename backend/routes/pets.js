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

// Tüm petleri listeleme (admin için)
router.get('/', authMiddleware, async (req, res) => {
  try {
    let filter = {};
    // Eğer owner ise sadece kendine ait petleri göster
    if (req.user.role === 'owner') {
      filter.ownerId = req.user.id;
    }
    const pets = await Pet.find(filter).populate('ownerId', 'name email');
    res.json(pets);
  } catch (err) {
    console.error('Pet listeleme hatası:', err);
    res.status(400).json({ error: err.message });
  }
});

// Kullanıcının hayvanlarını listeleme
router.get('/owner/:ownerId', authMiddleware, async (req, res) => {
  try {
    const pets = await Pet.find({ ownerId: req.params.ownerId });
    res.json(pets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Tek bir pet'i getirme
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('ownerId', 'name email');
    if (!pet) {
      return res.status(404).json({ error: 'Pet bulunamadı' });
    }
    
    // Sadece owner kendi petini görebilir (admin hariç)
    if (req.user.role === 'owner' && pet.ownerId._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }
    
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Evcil hayvan ekleme
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, species, age } = req.body;
    
    // Validation
    if (!name || !species || !age) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }
    
    if (age < 0 || age > 50) {
      return res.status(400).json({ error: 'Geçerli bir yaş giriniz (0-50)' });
    }
    
    const pet = new Pet({ 
      name, 
      species, 
      age, 
      ownerId: req.user.id // Token'dan alınan kullanıcı ID'si
    });
    
    await pet.save();
    res.status(201).json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Evcil hayvan güncelleme
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, species, age } = req.body;
    
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet bulunamadı' });
    }
    
    // Sadece owner kendi petini güncelleyebilir
    if (req.user.role === 'owner' && pet.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }
    
    // Validation
    if (age && (age < 0 || age > 50)) {
      return res.status(400).json({ error: 'Geçerli bir yaş giriniz (0-50)' });
    }
    
    // Güncelleme
    if (name) pet.name = name;
    if (species) pet.species = species;
    if (age) pet.age = age;
    
    await pet.save();
    res.json(pet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Evcil hayvan silme
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ error: 'Pet bulunamadı' });
    }
    
    // Sadece owner kendi petini silebilir (admin da silebilir)
    if (req.user.role === 'owner' && pet.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Bu işlem için yetkiniz yok' });
    }
    
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pet başarıyla silindi' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
