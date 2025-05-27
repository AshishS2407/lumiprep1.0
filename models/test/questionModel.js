// models/test/questionModel.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }, // for validation
});

// models/test/questionModel.js
const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  questionText: { type: String, required: true },
  options: [optionSchema],
  explanation: { type: String },
   addedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  updatedBy: {  // New field
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date  // New field
});

module.exports = mongoose.model('Question', questionSchema);
