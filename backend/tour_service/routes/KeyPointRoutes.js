const express = require('express');
const path = require('path');
const fs = require('fs');
const KeyPoint = require('../models/KeyPoint');
const authMiddleware = require('../middleware/authMiddleware'); // Importovanje authMiddleware-a

const router = express.Router();

// Kreiraj uploads direktorijum ako ne postoji
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ruta za kreiranje ključne tačke
router.post('/create-keypoint', authMiddleware, async (req, res) => {
    try {
        const { name, description, latitude, longitude, image } = req.body;
        const author = req.user.userId;

        console.log('Author ID:', author);

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
            image: imagePath,
            author // Dodavanje author polja
        });

        await newKeyPoint.save();
        res.status(201).json(newKeyPoint);
    } catch (error) {
        console.error('Error during create-point:', error);
        res.status(500).json({ message: error.message });
    }
});

// Dohvati sve ključne tačke
router.get('/keypoints', async (req, res) => {
    try {
        const keyPoints = await KeyPoint.find();
        res.status(200).json(keyPoints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Dohvati ključnu tačku po ID-ju
router.get('/keypoint/:keypointId', async (req, res) => {
    try {
        const keyPoint = await KeyPoint.findById(req.params.keypointId); // ispravljeno req.params.keypointId
        if (!keyPoint) {
            return res.status(404).json({ message: 'KeyPoint not found' });
        }
        res.status(200).json(keyPoint);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
