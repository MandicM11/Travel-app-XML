const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const authMiddleware = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.JWT_SECRET; // Koristite varijablu okruženja za tajni ključ

// Ruta za dobavljanje svih korisnika
router.get('/users',  async (req, res) => {
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

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, profilePicture, bio, motto, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, profilePicture, bio, motto, email, password: hashedPassword, role });

        try {
            const response = await axios.post('http://api-gateway:8000/tour-service/cart', {
                userId: user._id
            });
            console.log('Cart creation response:', response.data);
        } catch (error) {
            console.error('Error creating cart:', error.response ? error.response.data : error.message);
            throw new Error('Failed to create cart');
        }
        
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error.message);
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
  
      const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h', algorithm: 'HS256' });
  
      res.cookie('next-auth.session-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600 * 1000
      });
  
      res.send({ message: 'Login successful' });
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(400).send({ error: error.message });
    }
  });

  router.post('/simulator', async (req, res) => {
    const { lat, lng } = req.body;

    // Loguj tipove lat i lng
    console.log('Received lat:', lat, 'Type of lat:', typeof lat);
    console.log('Received lng:', lng, 'Type of lng:', typeof lng);

    // Proveri da li su lat i lng brojevi
    if (typeof lat !== 'number' || typeof lng !== 'number') {
        return res.status(400).json({ message: 'Invalid data type' });
    }

    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log('Parsed lat:', lat, 'Parsed lng:', lng);
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.currentPosition = { lat, lng };
        await user.save();

        res.status(200).json({ message: 'Location saved', lat, lng });
    } catch (error) {
        console.error('Error:', error); // Prikazuj detaljnije greške
        res.status(400).json({ error: error.message });
    }
});


// Ruta za dobavljanje trenutne pozicije korisnika
router.get('/simulator/current', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user || !user.currentPosition) {
            return res.status(404).json({ message: 'Location not found' });
        }

        res.status(200).json(user.currentPosition);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
