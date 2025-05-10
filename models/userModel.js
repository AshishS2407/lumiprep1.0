const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Required for both admin/user

  password: { type: String, required: true },

  lumiId: {
    type: String,
    unique: true,
    sparse: true, // allows null unless explicitly required
    match: /^KN\d{4}[A-Z0-9]+$/, // e.g. KN2025A3D4
  },

  email: {
    type: String,
    sparse: true, // allows either email or lumiId depending on user type
  },

  role: {
    type: String,
    enum: ['admin', 'user','mentor','superadmin'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', userSchema);


