const Publication = require('../models/Publication');

exports.getPublications = async (req, res) => {
  try {
    const publications = await Publication.find()
      .populate('projectId', 'title')
      .populate('owner', 'name')
      .sort({ publicationDate: -1, createdAt: -1 });
    res.json(publications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addPublication = async (req, res) => {
  try {
    const { title, doi, authors, publicationDate, pdfUrl, projectId } = req.body;

    const newPub = new Publication({
      title,
      doi,
      authors: Array.isArray(authors) ? authors : authors?.split(',').map(a => a.trim()),
      publicationDate,
      pdfUrl,
      projectId: projectId || null,
      owner: req.user.id
    });

    const pub = await newPub.save();
    res.json(pub);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
