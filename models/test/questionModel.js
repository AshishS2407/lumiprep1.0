// models/test/questionModel.js
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false }, // for validation
});

const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  questionText: { type: String, required: true },
  options: [optionSchema], // 4 options per question
  explanation: { type: String }, // New field
});

module.exports = mongoose.model('Question', questionSchema);
