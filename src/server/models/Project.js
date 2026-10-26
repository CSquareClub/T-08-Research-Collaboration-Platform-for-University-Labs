const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  abstract: { type: String, required: true },
  domain: { type: String, index: true },
  status: { type: String, enum: ['Open', 'Closed', 'Ongoing', 'Completed'], default: 'Open' },
  requiredSkills: [{ type: String }],
  teamSizeNeeded: { type: Number },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  milestones: [{
    title: { type: String, required: true },
    deadline: { type: Date },
    progress: { type: Number, default: 0 },
    approved: { type: Boolean, default: false }
  }]
}, { timestamps: true });

// Add text indexing for search
ProjectSchema.index({ title: 'text', abstract: 'text' });

module.exports = mongoose.model('Project', ProjectSchema);
