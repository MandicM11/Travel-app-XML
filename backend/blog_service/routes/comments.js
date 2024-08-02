const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Blog = require('../models/Blog');
const authMiddleware = require('../middleware/authMiddleware');
const checkFollow = require('../middleware/checkFollow');

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

module.exports = router;
