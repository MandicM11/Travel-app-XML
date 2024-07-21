const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registracija
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, profilePicture, bio, motto, email, password, role } = req.body;

        // Provera da li je rola validna
        if (!['tourist', 'guide'].includes(role)) {
            return res.status(400).json({ message: 'Nevalidna rola korisnika' });
        }
        
        // Provera da li korisnik već postoji
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Korisnik sa ovim emailom već postoji' });
        }

        // Hashovanje lozinke
        const hashedPassword = await bcrypt.hash(password, 10);

        // Kreiranje novog korisnika
        const newUser = new User({ firstName, lastName, profilePicture, bio, motto, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: 'Registracija uspešna' });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom registracije' });
    }
});

// Prijava
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Pronalazak korisnika
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Pogrešan email ili lozinka' });
        }

        // Provera lozinke
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Pogrešan email ili lozinka' });
        }

        // Generisanje JWT tokena
        const token = jwt.sign({ userId: user._id, role: user.role }, 'tajni_kljuc', { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Greška prilikom prijave' });
    }
});

module.exports = router;
