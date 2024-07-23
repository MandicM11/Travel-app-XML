const express = require('express');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Kreiranje novog bloga
router.post('/create', authMiddleware, async (req, res) => {
  const { title, description, images, status } = req.body;

  try {
    const blog = new Blog({
      title,
      description,
      images,
      status,
      author: req.user._id
    });

    await blog.save();
    res.status(201).send(blog);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Dohvaćanje svih blogova korisnika
router.get('/myblogs', authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id });
    res.status(200).send(blogs);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Dohvaćanje pojedinog bloga
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOne({ _id: req.params.id, author: req.user._id });

    if (!blog) {
      return res.status(404).send({ error: 'Blog not found' });
    }

    res.status(200).send(blog);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

module.exports = router;
