# 🐾 Veteriner Randevu Sistemi

Modern ve kullanıcı dostu bir veteriner randevu yönetim sistemi. React ve Node.js ile geliştirilmiştir.

## 📋 Özellikler

### 🔐 Kullanıcı Yönetimi
- JWT tabanlı kimlik doğrulama
- 3 farklı rol: Owner (Kullanıcı), Vet (Veteriner), Admin
- Güvenli şifre hashleme (bcryptjs)

### 📅 Randevu Yönetimi
- Kullanıcılar randevu oluşturabilir
- Admin ve veterinerler randevuları onaylayabilir/iptal edebilir
- Randevu durumu takibi (pending, approved, completed, cancelled)
- Tarih ve saat filtreleme

### 🐶 Pet (Hayvan) Yönetimi
- Kullanıcılar evcil hayvanlarını ekleyebilir
- Tür, yaş, isim bilgileri

### 👨‍⚕️ Veteriner Yönetimi
- Admin veteriner listesini yönetebilir
- Veteriner profil bilgileri

### 🎨 Modern Arayüz
- Responsive tasarım
- Sidebar navigasyon
- Role-based dashboard
- Animasyonlar (Framer Motion)
- Bootstrap styling

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14+)
- MongoDB (v4.4+)
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
```

#### Environment Variables (.env)
Backend klasöründe `.env` dosyası oluşturun:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/vet-booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

⚠️ **ÖNEMLİ:** `JWT_SECRET` değerini mutlaka değiştirin!

#### MongoDB Başlatma
```bash
mongod
```

#### Backend Sunucusunu Başlatma
```bash
npm start
# veya development için
npm run dev
```

### Frontend Kurulumu

```bash
cd frontend
npm install
```

#### Environment Variables (.env)
Frontend klasöründe `.env` dosyası oluşturun:

```env
REACT_APP_API_URL=http://localhost:5001
```

#### Frontend Sunucusunu Başlatma
```bash
npm start
```

Tarayıcınızda `http://localhost:3000` adresini açın.

## 📁 Proje Yapısı

```
vet-booking/
├── backend/
│   ├── models/           # MongoDB modelleri
│   │   ├── User.js
│   │   ├── Pet.js
│   │   └── Appointment.js
│   ├── routes/           # API route'ları
│   │   ├── auth.js
│   │   ├── pets.js
│   │   ├── appointments.js
│   │   └── vets.js
│   ├── middleware/       # Auth middleware'ler
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── app.js           # Express server
│   ├── .env             # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/   # React bileşenleri
    │   │   ├── Sidebar.js
    │   │   └── ProtectedRoute.js
    │   ├── context/      # Context API
    │   │   └── AuthContext.js
    │   ├── pages/        # Sayfa bileşenleri
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js
    │   │   ├── PetsPage.js
    │   │   ├── AppointmentsPage.js
    │   │   ├── VetsPage.js
    │   │   └── AdminAppointments.js
    │   ├── layouts/      # Layout bileşenleri
    │   ├── App.js
    │   └── index.js
    ├── .env             # Environment variables
    └── package.json
```

## 🔑 Kullanıcı Rolleri

### Owner (Kullanıcı)
- Pet ekleme/düzenleme/silme
- Randevu oluşturma
- Kendi randevularını görüntüleme

### Vet (Veteriner)
- Atanmış randevuları görüntüleme
- Randevu durumunu güncelleme

### Admin
- Tüm randevuları görüntüleme
- Randevuları onaylama/iptal etme/tamamlama
- Veteriner yönetimi
- Kullanıcı yönetimi

## 🛠️ Teknolojiler

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Axios** - HTTP client
- **Bootstrap** - CSS framework
- **Framer Motion** - Animations
- **React Icons** - Icon library

## 🔒 Güvenlik Özellikleri

✅ JWT tabanlı authentication  
✅ Şifre hashleme (bcryptjs)  
✅ Protected routes  
✅ Role-based access control  
✅ CORS yapılandırması  
✅ Environment variables  

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi

### Pets
- `GET /pets` - Pet listesi
- `POST /pets` - Pet ekleme
- `PUT /pets/:id` - Pet güncelleme
- `DELETE /pets/:id` - Pet silme

### Appointments
- `GET /api/appointments` - Randevu listesi (role-based)
- `POST /api/appointments` - Randevu oluşturma
- `PATCH /api/appointments/:id` - Randevu güncelleme

### Vets
- `GET /api/vets` - Veteriner listesi

## 🚧 Geliştirilmesi Gerekenler

### Yüksek Öncelik
- [ ] Error handling middleware
- [ ] Input validation (express-validator)
- [ ] Rate limiting
- [ ] Email notifications
- [ ] Password reset özelliği

### Orta Öncelik
- [ ] Pet fotoğraf upload
- [ ] Randevu çakışma kontrolü
- [ ] Profil düzenleme sayfası
- [ ] Toast notifications
- [ ] Pagination

### Düşük Öncelik
- [ ] API documentation (Swagger)
- [ ] Unit & Integration testler
- [ ] Docker yapılandırması
- [ ] CI/CD pipeline
- [ ] Dark mode

## 📄 Lisans

MIT License

## 👨‍💻 Geliştirici

Developed with ❤️ for veterinary clinics

---

### 🐛 Hata Bildirimi

Herhangi bir hata bulursanız lütfen issue açın.

### 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın
