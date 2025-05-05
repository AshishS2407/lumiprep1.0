const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  testTitle: { type: String, required: true },
  description: String,
  validTill: { type: Date }, // optional: to mark expiry
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // <-- duration in minutes
});

module.exports = mongoose.model('Test', testSchema);





