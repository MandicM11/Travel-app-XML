// user_service/index.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(express.json());

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
app.use('/user-service', userRoutes);

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`User service is running on port ${PORT}`);
});
