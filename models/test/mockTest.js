const mongoose = require('mongoose');

const mockTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,  // Adds createdAt and updatedAt fields automatically
});

const MockTest = mongoose.model('MockTest', mockTestSchema);

module.exports = MockTest;
