require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const keyPointRoutes = require('./routes/KeyPointRoutes');
const tourRoutes = require('./routes/tourRoutes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middleware/authMiddleware');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://user-service:8001', 'http://blog-service:8002', 'http://tour-service:8003'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Omogućava slanje kolačića
}));
app.use(express.json({ limit: '50mb' })); // Povećavamo limit za JSON payload
app.use(cookieParser()); // Dodajemo middleware za kolačiće

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// MongoDB konekcija
mongoose.connect('mongodb://mongo:27017/touristDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Koristi rute
app.use(authMiddleware, keyPointRoutes); // Autentifikacija za /keypoints rute
app.use(authMiddleware, tourRoutes);

const PORT = process.env.PORT || 8003;
app.listen(PORT, () => {
    console.log(`Tour service is running on port ${PORT}`);
    console.log('NODE_ENV:', process.env.NODE_ENV);
});
