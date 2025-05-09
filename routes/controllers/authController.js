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


exports.createUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const lumiId = `KN${year}${random}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      password: hashedPassword,
      lumiId,
      role: 'user',
    });

    res.status(201).json({
      message: 'User created',
      lumiId,
      name,
      password // plain text sent back (only for display after creation)
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
};

// Updated controller to include test scores
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch users with their test scores
    const users = await User.aggregate([
      {
        $lookup: {
          from: "useranswers",
          localField: "_id",
          foreignField: "userId",
          as: "testSubmissions"
        }
      },
      {
        $project: {
          name: 1,
          lumiId: 1,
          testCount: { $size: "$testSubmissions" },
          avgScore: {
            $ifNull: [
              {
                $avg: "$testSubmissions.scorePercentage"
              },
              0
            ]
          }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.status(200).json({
      message: 'Users retrieved successfully',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};


exports.userLogin = async (req, res) => {
  try {
    const { lumiId, password } = req.body;

    const user = await User.findOne({ lumiId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

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
        name: user.name,
        lumiId: user.lumiId,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};
