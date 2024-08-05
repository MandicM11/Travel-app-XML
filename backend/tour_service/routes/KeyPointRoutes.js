const express = require('express');
const path = require('path');
const fs = require('fs');
const KeyPoint = require('../models/KeyPoint');

const router = express.Router();

// Kreiraj uploads direktorijum ako ne postoji
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post('/create-keypoint', async (req, res) => {
    try {
        const { name, description, latitude, longitude, image } = req.body;

        let imagePath = null;
        if (image && image !== '') {
            // Obrada base64 slike
            const buffer = Buffer.from(image, 'base64');
            imagePath = path.join(uploadsDir, `image${Date.now()}.jpg`);
            fs.writeFileSync(imagePath, buffer);
        }

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
        console.error('Error during create-point:', error);
        res.status(500).json({ message: error.message });
    }
});

// Dohvati sve ključne tačke
router.get('/keypoint/all', async (req, res) => {
    try {
        const keyPoints = await KeyPoint.find();
        res.status(200).json(keyPoints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dohvati ključnu tačku po ID-ju
router.get('/keypoint/:keyPointId', async (req, res) => {
    try {
        const keyPoint = await KeyPoint.findById(req.params.id);
        if (!keyPoint) {
            return res.status(404).json({ message: 'KeyPoint not found' });
        }
        res.status(200).json(keyPoint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
