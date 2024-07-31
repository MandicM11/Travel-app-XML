const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // Tajni ključ za verifikaciju tokena

const authMiddleware = (req, res, next) => {
    // Uzimanje tokena iz kolačića
    const token = req.cookies['session-token']; // Uveri se da je ovo ime u skladu sa imenom u NextAuth

    console.log('Token from cookies in authMiddleware:', token); // Logovanje tokena za provere

    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
