const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }
});

const mockQuestionSchema = new mongoose.Schema({
  mockTestId: { type: mongoose.Schema.Types.ObjectId, ref: 'MockTest', required: true },
  questionText: { type: String, required: true },
  options: { 
    type: [optionSchema],
    validate: [arr => arr.length === 4, 'Must provide 4 options']
  },
  explanation: { type: String },

  // Changed from ObjectId ref to simple String
  subTestCategory: {
    type: String,
    required: true,
    trim: true
  },

  addedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('MockQuestion', mockQuestionSchema);
