const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Proveri da li je putanja tačna
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = '12345';

// Dummy GET ruta
router.get('/', (req, res) => {
    res.send('User Service');
});

// Registracija korisnika
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, profilePicture, bio, motto, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, profilePicture, bio, motto, email, password: hashedPassword, role });
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
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

        res.send({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
