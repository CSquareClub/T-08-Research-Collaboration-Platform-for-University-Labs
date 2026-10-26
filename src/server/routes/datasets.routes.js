const express = require('express');
const router = express.Router();
const datasetsController = require('../controllers/datasets.controller');
const auth = require('../middleware/auth');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'researchhub_datasets',
    allowed_formats: ['csv', 'pdf', 'jpg', 'png', 'zip', 'json', 'txt'],
  },
});

const upload = multer({ storage: storage });

// @route   GET api/datasets
// @desc    Get all datasets
// @access  Private
router.get('/', auth, datasetsController.getDatasets);

// @route   GET api/datasets/:id
// @desc    Get dataset by ID
// @access  Private
router.get('/:id', auth, datasetsController.getDatasetById);

// @route   POST api/datasets
// @desc    Upload new dataset
// @access  Private
router.post('/', auth, upload.single('file'), datasetsController.uploadDataset);

// @route   PUT api/datasets/:id
// @desc    Update dataset or upload new version
// @access  Private
router.put('/:id', auth, upload.single('file'), datasetsController.updateDataset);

module.exports = router;
