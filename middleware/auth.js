const passport = require('passport');

module.exports = {
  // Middleware to check if user is authenticated
  isAuthenticated: passport.authenticate('jwt', { session: false }),
  
  // Middleware to check if user is admin
  isAdmin: (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  },

  // Middleware to check if user matches the requested user ID or is admin
  isOwnerOrAdmin: (req, res, next) => {
    if (req.user && (req.user._id.toString() === req.params.userId || req.user.role === 'admin')) {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Not authorized.' });
  }
};
