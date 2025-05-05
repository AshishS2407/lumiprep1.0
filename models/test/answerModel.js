// models/test/userAnswerModel.js
const mongoose = require('mongoose');

const userAnswerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOptionIndex: Number, // 0-3 based on options array
  }],
  submittedAt: { type: Date },
});

module.exports = mongoose.model('UserAnswer', userAnswerSchema);
