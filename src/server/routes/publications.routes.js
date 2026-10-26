const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const publicationsController = require('../controllers/publications.controller');

// @route   GET api/publications
// @desc    Get all publications
// @access  Private
router.get('/', auth, publicationsController.getPublications);

// @route   POST api/publications
// @desc    Add a publication
// @access  Private
router.post('/', auth, publicationsController.addPublication);

module.exports = router;
