const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, 'tajni_kljuc');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Neautorizovan pristup' });
    }
};

const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Pristup zabranjen' });
        }
        next();
    };
};

module.exports = { authMiddleware, roleMiddleware };
