module.exports = function(req, res, next) {
  // Assuming user roles are stored in req.user.roles
  if (!req.user || !req.user.roles.includes('admin')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};