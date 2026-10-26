const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Faculty', 'PI', 'Admin'], default: 'Student' },
  department: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  profilePicUrl: { type: String },
  publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
