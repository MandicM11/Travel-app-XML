require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/follow');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // Dodajemo cookie-parser
const authMiddleware = require('./middleware/authMiddleware');



const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://user-service:8001', 'http://blog-service:8002', 'http://tour-service:8003'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Omogućava slanje kolačića
}));
app.use(express.json());
app.use(cookieParser()); // Dodajemo middleware za kolačiće

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
app.use(userRoutes); // Rute za korisnike
app.use(authMiddleware, followRoutes); // Autentifikacija za /follow rute

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
    console.log('NODE_ENV:', process.env.NODE_ENV);
});
