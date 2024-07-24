const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const blogRoutes = require('./routes/blogRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const app = express();
const cors = require('cors');


app.use(cors({
  origin: 'http://localhost:3000', // URL vaše frontend aplikacije
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode koje želite da omogućite
  allowedHeaders: ['Content-Type', 'Authorization'] // Naslovi koje želite da omogućite
}));

app.use(express.json({ limit: '10mb' })); // Povećanje limita za velike base64 stringove

// MongoDB konekcija
mongoose.connect('mongodb://mongo:27017/touristDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

// Koristi blog rute, uključujući autentifikaciju
app.use(authMiddleware, blogRoutes); // Dodaj authMiddleware ovde ako sve rute zahtevaju autentifikaciju

// Pokreni server
const port = process.env.PORT || 8002;
app.listen(port, () => {
  console.log(`Blog service running on port ${port}`);
});
