// user_service/index.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware za parsiranje JSON-a
app.use(express.json());

// Povezivanje sa MongoDB
mongoose.connect('mongodb://mongo:27017/touristDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

// Osnovna ruta
app.get('/', (req, res) => {
    res.send('User Service');
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
