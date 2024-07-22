// user_service/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Proveri da li je putanja tačna

// Dummy GET ruta
router.get('/', (req, res) => {
    res.send('User Service');
});


// Registracija korisnika
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, profilePicture, bio, motto, email, password, role } = req.body;
        const user = new User({ firstName, lastName, profilePicture, bio, motto, email, password, role });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Prijava korisnika
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }
        res.send({ message: 'Login successful', user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
