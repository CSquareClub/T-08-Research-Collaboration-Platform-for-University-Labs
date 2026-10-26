const Dataset = require('../models/Dataset');

exports.getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find()
      .populate('owner', 'name')
      .populate('projectId', 'title')
      .sort({ createdAt: -1 });
    res.json(datasets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getDatasetById = async (req, res) => {
  try {
    const dataset = await Dataset.findById(req.params.id)
      .populate('owner', 'name')
      .populate('projectId', 'title');
    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.json(dataset);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.status(500).send('Server Error');
  }
};

exports.uploadDataset = async (req, res) => {
  try {
    const { title, description, projectId, access } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const fileUrl = req.file.path; // Cloudinary URL

    const dataset = new Dataset({
      title,
      description,
      owner: req.user.id,
      projectId: projectId || null,
      fileUrl,
      access: access || 'public',
      versions: [{
        version: 1,
        url: fileUrl
      }]
    });

    await dataset.save();
    res.json(dataset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateDataset = async (req, res) => {
  try {
    const { title, description, access } = req.body;
    let dataset = await Dataset.findById(req.params.id);

    if (!dataset) {
      return res.status(404).json({ message: 'Dataset not found' });
    }

    // Make sure user owns dataset
    if (dataset.owner.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    dataset.title = title || dataset.title;
    dataset.description = description || dataset.description;
    dataset.access = access || dataset.access;

    // Handle new version upload
    if (req.file) {
      const newVersion = dataset.versions.length + 1;
      const fileUrl = req.file.path;
      dataset.fileUrl = fileUrl;
      dataset.versions.push({
        version: newVersion,
        url: fileUrl
      });
    }

    await dataset.save();
    res.json(dataset);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dataset not found' });
    }
    res.status(500).send('Server Error');
  }
};
