const jwt = require('jsonwebtoken');
const SECRET_KEY = 'epdeMexico';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token requerido' });

  jwt.verify(token.replace('Bearer ', ''), SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });

    req.user = decoded; // opcional: puedes acceder a `req.user` luego
    next();
  });
};

module.exports = verifyToken;
