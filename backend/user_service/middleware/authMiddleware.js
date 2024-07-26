const jwt = require('jsonwebtoken');
const SECRET_KEY = '12345';

const authMiddleware = (req, res, next) => {
    try {
        // Uzimanje Authorization header-a iz zahteva
        const authHeader = req.headers['authorization'];

        // Ako authHeader nije prisutan, vraća grešku 401
        if (!authHeader) {
            return res.status(401).send({ error: 'No token provided' });
        }

        // Uklanjanje 'Bearer ' prefiksa, ako postoji
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

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
