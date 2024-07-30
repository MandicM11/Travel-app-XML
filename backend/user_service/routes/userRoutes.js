const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = '12345';

// Ruta za dobavljanje svih korisnika
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Isključujemo polje password
        res.send(users);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Get user ruta
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Isključujemo polje password
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
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

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        res.send({ token }); // Send JWT token to frontend

    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).send({ error: error.message });
    }
});

module.exports = router;
