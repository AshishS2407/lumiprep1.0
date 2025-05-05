const mongoose = require('mongoose');

const userTestStatusSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  status: { type: String, enum: ['Upcoming', 'Submitted', 'Expired'], default: 'Upcoming' }
});

module.exports = mongoose.model('UserTestStatus', userTestStatusSchema);
