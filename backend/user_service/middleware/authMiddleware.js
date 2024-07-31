const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

console.log('Backend JWT Secret:', SECRET_KEY);

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies['session-token'] || req.headers['authorization']?.split(' ')[1];
    console.log('Backend Token:', token);

    if (!token) {
      return res.status(401).send({ error: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, { algorithms: ['HS256'] }, (err, user) => {
      if (err) {
        return res.status(403).send({ error: 'Invalid token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = authMiddleware;
