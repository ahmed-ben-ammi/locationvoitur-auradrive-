// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token invalide',
      error: 'INVALID_TOKEN'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expiré',
      error: 'TOKEN_EXPIRED'
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
    error: err.name || 'INTERNAL_ERROR'
  });
};

module.exports = {
  errorHandler
};

