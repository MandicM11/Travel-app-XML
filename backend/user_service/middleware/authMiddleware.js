const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || '12345'; // Koristite varijablu okruženja za tajni ključ

const authMiddleware = (req, res, next) => {
  try {
    // Pretražuje token u kolačićima ili u zaglavlju Authorization
    const token = req.cookies['session-token'] || req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).send({ error: 'No token provided' });
    }

    // Verifikujte JWT token
    jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, user) => {
      if (err) {
        return res.status(403).send({ error: 'Invalid token' });
      }

      // Prikačite korisnika u objekat zahteva
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = authMiddleware;
