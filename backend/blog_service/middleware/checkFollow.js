const axios = require('axios');
const jwt = require('jsonwebtoken'); // Ako koristite JWT za verifikaciju tokena
const Blog = require('../models/Blog');
const SECRET_KEY = '12345'; // Tajni ključ za verifikaciju tokena

const USER_SERVICE_URL = 'http://api-gateway:8000/user-service'; // URL za pristup korisnicima preko API Gateway-a

const checkFollow = async (req, res, next) => {
    try {
        // Očitavanje tokena iz kolačića
        const token = req.cookies['session-token']; // Provjerite da li je ovo ime u skladu sa imenom u Postmanu

        console.log('Token from cookies in checkFollow:', token); // Logovanje tokena za provere

        if (!token) {
            return res.status(401).send({ error: 'No token provided' });
        }

        // Verifikacija tokena
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // Dodeljujemo korisnika za dalje korišćenje

        const userId = req.user._id;
        const blogId = req.params.id;

        console.log(`Checking follow for userId: ${userId} and blogId: ${blogId}`);

        // Pronađite blog
        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }

        // Pronađite autora bloga putem API poziva
        let author;
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/${blog.author}`);
            author = response.data;
        } catch (error) {
            return res.status(404).send({ error: 'Author not found' });
        }

        // Pronađite korisnika putem API poziva
        let user;
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/${userId}`);
            user = response.data;
        } catch (error) {
            return res.status(404).send({ error: 'User not found' });
        }

        // Proverite da li je korisnik zapratio autora bloga
        const isFollowing = user.following.includes(author._id);

        if (!isFollowing) {
            return res.status(403).send({ error: 'You must follow the author to comment' });
        }

        next();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = checkFollow;
