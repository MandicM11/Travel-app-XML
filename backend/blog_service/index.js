require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const commentRoutes = require('./routes/comments');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Dodajte cookie-parser



const app = express();

// CORS konfiguracija
app.use(cors({
  origin: 'http://localhost:3000', // Frontend adresa
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Omogućava slanje kolačića
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser()); // Dodajte cookie-parser middleware

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
