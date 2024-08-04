const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key'; // Tajni ključ za verifikaciju tokena

const authMiddleware = (req, res, next) => {
    // Uzimanje tokena iz Authorization header-a
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    console.log('Token from header in authMiddleware:', token); // Logovanje tokena za provere

    if (!token) {
        return res.status(401).send({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;

        // Proveravamo da li korisnik ima ulogu Author
        if (req.user.role !== 'Author') {
            return res.status(403).send({ error: 'Forbidden: You do not have the required role' });
        }

        next();
    } catch (err) {
        res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
