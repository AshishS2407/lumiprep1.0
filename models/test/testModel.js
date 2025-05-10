// models/test/testModel.js

const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  companyName: String,
  testTitle: String,
  description: String,
  validTill: Date,
  duration: Number,
  testType: { type: String, enum: ['main', 'sub'], required: true },
  parentTestIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }]
});

module.exports = mongoose.model('Test', testSchema);




