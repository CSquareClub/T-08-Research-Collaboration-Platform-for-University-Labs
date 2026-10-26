const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const usersController = require('../controllers/users.controller');

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, usersController.getCurrentUser);

// @route   PUT api/users/me
// @desc    Update current profile
// @access  Private
router.put('/me', auth, usersController.updateProfile);

// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', auth, usersController.getUserById);

module.exports = router;
