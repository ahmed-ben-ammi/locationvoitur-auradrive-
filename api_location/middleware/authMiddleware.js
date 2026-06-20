
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Token d\'accès requis',
      error: 'NO_TOKEN_PROVIDED'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      CNE: decoded.CNE,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expiré',
        error: 'TOKEN_EXPIRED'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Token invalide',
        error: 'INVALID_TOKEN'
      });
    } else {
      return res.status(401).json({ 
        message: 'Erreur d\'authentification',
        error: 'AUTH_ERROR'
      });
    }
  }
};

module.exports = {
  authenticateToken
};