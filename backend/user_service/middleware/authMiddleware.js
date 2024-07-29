const jwt = require('jsonwebtoken');
const SECRET_KEY = '12345';

const authMiddleware = (req, res, next) => {
    try {
        // Uzimanje kolačića iz zahteva
        const token = req.cookies['next-auth.session-token'];

        // Ako token nije prisutan, vraća grešku 401
        if (!token) {
            return res.status(401).send({ error: 'No token provided' });
        }

        // Verifikacija JWT tokena
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(403).send({ error: 'Invalid token' });
            }

            // Ako je token validan, dodaj korisnika u request
            req.user = user;
            next();
        });
    } catch (error) {
        // U slučaju nepredviđene greške, vraća grešku 500
        res.status(500).send({ error: error.message });
    }
};

module.exports = authMiddleware;
