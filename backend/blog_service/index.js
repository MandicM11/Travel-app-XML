require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const commentRoutes = require('./routes/comments');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const cookieParser = require('cookie-parser'); // Dodajte cookie-parser



const app = express();

// CORS konfiguracija
app.use(cors({
  origin: ['http://localhost:3000', 'http://user-service:8001', 'http://blog-service:8002', 'http://tour-service:8003'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Omogućava slanje kolačića
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // Dodajte cookie-parser middleware

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Povezivanje sa MongoDB
mongoose.connect('mongodb://mongo:27017/touristDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Rute
app.use(authMiddleware, blogRoutes); // Autentifikacija samo za /blogs rute
app.use(commentRoutes); // Autentifikacija samo za /comments rute

const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Blog service running on port ${port}`);
});
