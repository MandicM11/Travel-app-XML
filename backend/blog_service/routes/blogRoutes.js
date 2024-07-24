const express = require('express');
const fs = require('fs');
const path = require('path');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, creationDate, images, status } = req.body;

  try {
    // Validacija podataka
    if (!title || !description || !creationDate || !status) {
      return res.status(400).send({ error: 'Title, description, creation date, and status are required.' });
    }

    // Obrada base64 slika
    const imagePaths = [];
    if (images && images.length > 0) {
      images.forEach((base64String, index) => {
        const buffer = Buffer.from(base64String, 'base64');
        const imagePath = path.join(__dirname, '../uploads', `image${Date.now()}_${index}.jpg`);
        fs.writeFileSync(imagePath, buffer);
        imagePaths.push(imagePath);
      });
    }

    // Čuvanje bloga u bazi podataka
    const blog = new Blog({
      title,
      description,
      creationDate,
      images: imagePaths, 
      status,
      author: req.user._id 
    });

    await blog.save();
    res.status(201).send(blog);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
