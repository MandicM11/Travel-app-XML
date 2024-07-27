const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Follow a user
router.post('/follow', authMiddleware, async (req, res) => {
    try {
        const { followingId } = req.body;
        const followerId = req.user._id;

        console.log('Follower ID:', followerId);
        console.log('Following ID:', followingId);

        if (!followingId) {
            return res.status(400).json({ error: 'followingId is required' });
        }

        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });

        if (existingFollow) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        const follow = new Follow({ follower: followerId, following: followingId });
        await follow.save();

        await User.findByIdAndUpdate(followerId, { $addToSet: { following: followingId } });

        res.status(201).json(follow);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unfollow a user
router.delete('/unfollow/:followingId', authMiddleware, async (req, res) => {
    try {
        const { followingId } = req.params;
        const followerId = req.user._id;

        if (!followingId) {
            return res.status(400).json({ error: 'followingId is required' });
        }

        const follow = await Follow.findOne({ follower: followerId, following: followingId });

        if (!follow) {
            return res.status(404).json({ error: 'Follow relationship not found' });
        }

        await Follow.findOneAndDelete({ follower: followerId, following: followingId });

        await User.findByIdAndUpdate(followerId, { $pull: { following: followingId } });

        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Check follow status
router.get('/follow-status/:followingId', authMiddleware, async (req, res) => {
    try {
        const { followingId } = req.params;
        const followerId = req.user._id;

        console.log('Follower ID:', followerId);
        console.log('Following ID:', followingId);

        const existingFollow = await Follow.findOne({ follower: followerId, following: followingId });

        res.status(200).json({ isFollowing: !!existingFollow });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
