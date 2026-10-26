const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const collabController = require('../controllers/collaboration.controller');

// @route   POST api/collaboration-requests
// @desc    Send a collaboration request
// @access  Private
router.post('/', auth, collabController.sendRequest);

// @route   GET api/collaboration-requests
// @desc    Get all collaboration requests for the logged in user
// @access  Private
router.get('/', auth, collabController.getRequests);

// @route   PUT api/collaboration-requests/:id
// @desc    Update request status (Accept/Reject)
// @access  Private
router.put('/:id', auth, collabController.updateRequestStatus);

module.exports = router;
