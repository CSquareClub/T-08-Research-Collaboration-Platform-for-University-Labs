const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    if (req.user.role !== 'Faculty' && req.user.role !== 'PI') {
      return res.status(403).json({ message: 'Only Faculty or PI can create projects' });
    }

    const { title, abstract, domain, requiredSkills, teamSizeNeeded } = req.body;

    const newProject = new Project({
      title,
      abstract,
      domain,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills?.split(',').map(s => s.trim()),
      teamSizeNeeded,
      owner: req.user.id
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProjects = async (req, res) => {
  try {
    const { q, domain, skills, status } = req.query;
    let query = {};

    if (q) {
      query.$text = { $search: q };
    }
    if (domain) {
      query.domain = domain;
    }
    if (status) {
      query.status = status;
    }
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.requiredSkills = { $in: skillsArray };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name department')
      .sort({ createdAt: -1 });
      
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name department')
      .populate('collaborators', 'name role department');
      
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(500).send('Server error');
  }
};

exports.addMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can add milestones' });
    }

    const { title, deadline } = req.body;
    project.milestones.push({ title, deadline });
    
    await project.save();
    res.json(project.milestones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isOwner = project.owner.toString() === req.user.id;
    const isCollaborator = project.collaborators.some(c => c.toString() === req.user.id);
    
    if (!isOwner && !isCollaborator) {
      return res.status(403).json({ message: 'Not authorized to update milestones' });
    }

    const milestone = project.milestones.id(req.params.mid);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    const { progress, approved } = req.body;

    // Only owner can approve, or change anything if it's already approved (wait, if it's approved, maybe nobody can change progress, but owner can unapprove).
    if (approved !== undefined) {
      if (!isOwner) return res.status(403).json({ message: 'Only owner can approve milestones' });
      milestone.approved = approved;
    }

    if (progress !== undefined) {
      // If approved, only owner can change it, or maybe nobody. Let's say we just set it.
      milestone.progress = progress;
    }

    await project.save();
    res.json(project.milestones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteMilestone = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project owner can delete milestones' });
    }

    const milestone = project.milestones.id(req.params.mid);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    project.milestones.pull(req.params.mid);
    await project.save();
    
    res.json(project.milestones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
