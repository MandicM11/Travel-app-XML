const express = require('express');
const router = express.Router();
const axios = require('axios');
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');
const checkFollow = require('../middleware/checkFollow');

// Konfigurišite bazni URL za user-service
const userServiceUrl = 'http://user-service:8001';


router.post('/:id/comments', authMiddleware, checkFollow, async (req, res) => {
    console.log('Handling POST /:id/comments');
    console.log(`Request Body: ${JSON.stringify(req.body)}`);
    console.log(`Request Params: ${JSON.stringify(req.params)}`);

    try {
        const { content } = req.body;
        const userId = req.user.userId;
        const blogId = req.params.id;

        console.log(`Processing comment for blogId: ${blogId}`);
        const blog = await Blog.findById(blogId);
        console.log('Blog:', blog);

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        const comment = new Comment({ content, author: userId, blog: blogId });
        await comment.save();

        res.status(201).json(comment);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/:id/comments', async (req, res) => {
    try {
        const { id } = req.params;
        const comments = await Comment.find({ blog: id }).lean(); // Use lean() for faster queries

        // Map through comments to add user information
        const commentsWithUserDetails = await Promise.all(comments.map(async (comment) => {
            const userResponse = await axios.get(`${userServiceUrl}/${comment.author}`);
            comment.author = userResponse.data;
            return comment;
        }));

        res.status(200).json(commentsWithUserDetails);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments' });
    }
});

module.exports = router;
