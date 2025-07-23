const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  name: { type: String },
  roll: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  category: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  filePath: { type: String },
  status: { type: String, default: 'Pending' }, 
  remarks: { type: String, default: '' }, // New field for remarks
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grievance', grievanceSchema);