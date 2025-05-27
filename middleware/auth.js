// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify the decoded token has required fields
    if (!decoded.id || !decoded.name) {
      return res.status(401).json({ message: "Malformed token payload" });
    }

    req.user = {
      id: decoded.id,       // User's MongoDB _id
      name: decoded.name,   // User's name
      role: decoded.role    // User's role (admin/user/etc)
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};