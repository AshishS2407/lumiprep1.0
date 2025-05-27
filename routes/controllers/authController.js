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

    // Sign JWT with user details
    const token = jwt.sign(
      { 
        id: user._id, 
        name: user.name,  // Added name to token payload
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,  // Added name to response
        email: user.email,
        username: user.username,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.createUser = async (req, res) => {
  try {
    const { name, password, lumiId } = req.body;

    if (!name || !password || !lumiId) {
      return res.status(400).json({ message: 'Name, password, and lumiId are required' });
    }

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
      password // plain text just for return (only for display if necessary)
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


exports.getOnlyUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { role: "user" } },
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
          usertype: 1,
          testCount: { $size: "$testSubmissions" },
          avgScore: {
            $ifNull: [{ $avg: "$testSubmissions.scorePercentage" }, 0]
          }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.status(200).json({
      message: "User-role users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
      error: error.message
    });
  }
};

exports.getAdminMentorSuperadminUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          role: { $in: ["admin", "mentor", "superadmin"] }
        }
      },
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
          usertype: 1,
          role: 1, // ✅ Now the role will be included in the output
          testCount: { $size: "$testSubmissions" },
          avgScore: {
            $ifNull: [{ $avg: "$testSubmissions.scorePercentage" }, 0]
          }
        }
      },
      { $sort: { name: 1 } }
    ]);

    res.status(200).json({
      message: "Admin/Mentor/Superadmin users retrieved successfully",
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
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



exports.createAdmin = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Get the user's role from the JWT token
    const userRole = req.user.role;  // Assuming user info is stored in req.user after authentication

    // Ensure the user is allowed to create an admin (only superadmins and admins are allowed)
    if (userRole !== "superadmin" && userRole !== "admin") {
      return res.status(403).json({ message: "You do not have permission to create new admins." });
    }

    // Validate required fields
    if (!email || !password || !role)
      return res.status(400).json({ message: 'Email, password, and role are required' });

    // Ensure the role is one of the allowed roles
    const allowedRoles = ['admin', 'superadmin', 'mentor'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if the email already exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with the specified role
    const newUser = await User.create({
      name: email.split('@')[0], // Automatically generate the name from the email
      email,
      password: hashedPassword,
      role, // Set the role dynamically
    });

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

