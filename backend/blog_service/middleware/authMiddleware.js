const jwt = require('jsonwebtoken');
const SECRET_KEY = '12345';

const authMiddleware = (req, res, next) => {
  // Pristupi Authorization header-u
  const authHeader = req.headers['authorization'];

  // Proveri da li postoji Authorization header i da li je u formatu Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ error: 'No token provided or token format is incorrect.' });
  }

  // Izvuci token iz header-a
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verifikuj token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
