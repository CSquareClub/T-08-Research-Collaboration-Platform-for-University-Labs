const mongoose = require('mongoose');

const CollaborationRequestSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  message: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CollaborationRequest', CollaborationRequestSchema);
