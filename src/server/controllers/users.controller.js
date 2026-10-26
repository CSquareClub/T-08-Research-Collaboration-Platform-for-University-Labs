const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
      .populate('projects', 'title status');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, department, skills, interests, profilePicUrl } = req.body;
    const userFields = {};
    if (name) userFields.name = name;
    if (department) userFields.department = department;
    if (skills) userFields.skills = Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim());
    if (interests) userFields.interests = Array.isArray(interests) ? interests : interests.split(',').map(interest => interest.trim());
    if (profilePicUrl) userFields.profilePicUrl = profilePicUrl;

    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: userFields },
      { new: true }
    ).select('-passwordHash');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash')
      .populate('projects', 'title status');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).send('Server error');
  }
};
