const express = require('express');
const path = require('path');
const fs = require('fs');
const KeyPoint = require('../models/KeyPoint');

const router = express.Router();

router.post('/create-point', async (req, res) => {
    try {
        const { name, description, latitude, longitude, image } = req.body;

        // Obrada base64 slike
        const buffer = Buffer.from(image, 'base64');
        const imagePath = path.join(__dirname, '../uploads', `image${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, buffer);

        const newKeyPoint = new KeyPoint({
            name,
            description,
            latitude,
            longitude,
            image: imagePath
        });

        await newKeyPoint.save();
        res.status(201).json(newKeyPoint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dodavanje GET ruta

// Get all key points
router.get('/', async (req, res) => {
    try {
        const keyPoints = await KeyPoint.find();
        res.status(200).json(keyPoints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get key point by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const keyPoint = await KeyPoint.findById(id);
        if (!keyPoint) {
            return res.status(404).json({ message: 'Key point not found' });
        }
        res.status(200).json(keyPoint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
