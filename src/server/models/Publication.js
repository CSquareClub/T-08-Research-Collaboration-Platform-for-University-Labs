const mongoose = require('mongoose');

const PublicationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  doi: { type: String },
  authors: [{ type: String }],
  publicationDate: { type: Date },
  pdfUrl: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

PublicationSchema.index({ title: 'text' });

module.exports = mongoose.model('Publication', PublicationSchema);
