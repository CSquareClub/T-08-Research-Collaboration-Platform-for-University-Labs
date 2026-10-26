const CollaborationRequest = require('../models/CollaborationRequest');
const Project = require('../models/Project');

exports.sendRequest = async (req, res) => {
  try {
    const { projectId, message } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    // Check if request already exists
    const existingReq = await CollaborationRequest.findOne({ from: req.user.id, projectId });
    if (existingReq) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const newRequest = new CollaborationRequest({
      from: req.user.id,
      to: project.owner,
      projectId,
      message
    });

    const request = await newRequest.save();

    // Emit real-time notification to project owner
    if (req.io) {
      req.io.to(project.owner.toString()).emit('notification', {
        type: 'newRequest',
        message: `You have a new collaboration request for project: ${project.title}`,
        projectId: project._id,
        sender: req.user.id
      });
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getRequests = async (req, res) => {
  try {
    // Get requests sent TO this user (as project owner) OR sent BY this user
    const requests = await CollaborationRequest.find({
      $or: [{ to: req.user.id }, { from: req.user.id }]
    })
      .populate('from', 'name department skills')
      .populate('projectId', 'title status')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    let request = await CollaborationRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Ensure the current user is the owner of the project receiving the request
    if (request.to.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await request.save();

    if (status === 'Accepted') {
      const project = await Project.findById(request.projectId);
      if (project && !project.collaborators.includes(request.from)) {
        project.collaborators.push(request.from);
        await project.save();
      }
    }

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
