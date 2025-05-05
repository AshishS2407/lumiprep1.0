const jwt = require('jsonwebtoken');
const User = require('../../models/userModel');
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
      const { email, username, password, role } = req.body;
  
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        role: role || 'user', // default to 'user' if role not passed
      });
  
      res.status(201).json({ message: 'User created', userId: newUser._id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  

  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      // Sign JWT with role and id
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role // ✅ Include role in response for easy debugging
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
