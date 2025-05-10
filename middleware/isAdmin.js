module.exports = (req, res, next) => {
  const allowedRoles = ['admin', 'superadmin', 'mentor'];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: Only admin, superadmin, or mentor allowed' });
  }

  next();
};
