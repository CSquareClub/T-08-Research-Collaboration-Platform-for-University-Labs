const mongoose = require('mongoose');

const DatasetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  fileUrl: { type: String, required: true },
  access: { type: String, enum: ['public', 'private'], default: 'public' },
  versions: [{
    version: { type: Number },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

DatasetSchema.index({ owner: 1, projectId: 1 });
DatasetSchema.index({ title: 'text' });

module.exports = mongoose.model('Dataset', DatasetSchema);
