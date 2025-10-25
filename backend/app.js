// Backend giriş noktası
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Route'ları ekle
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);
const petRoutes = require('./routes/pets');
app.use('/pets', petRoutes);
const appointmentRoutes = require('./routes/appointments');
app.use('/appointments', appointmentRoutes);
const vetRoutes = require('./routes/vets');
app.use('/vets', vetRoutes);

// MongoDB bağlantısı
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/vet-booking';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB bağlantısı başarılı');
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB bağlantı hatası:', err);
});
