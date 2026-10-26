const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

const demoUsers = [
  {
    name: 'Alice Student',
    email: 'student@researchhub.edu',
    password: 'password123',
    role: 'Student',
    department: 'Computer Science',
    skills: ['React', 'Node.js', 'JavaScript', 'Python'],
    interests: ['AI', 'Web Development'],
  },
  {
    name: 'Dr. Bob PI',
    email: 'pi@researchhub.edu',
    password: 'password123',
    role: 'PI',
    department: 'Computer Science',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Data Science'],
    interests: ['Machine Learning', 'Deep Learning'],
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in the environment variables.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing users and projects to start fresh (optional, but good for demo setup)
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing users and projects.');

    // Hash passwords and save users
    const createdUsers = [];
    for (const u of demoUsers) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(u.password, salt);

      const user = new User({
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        department: u.department,
        skills: u.skills,
        interests: u.interests,
      });

      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Seeded user: ${savedUser.name} (${savedUser.role})`);
    }

    // Optionally seed a sample project owned by the PI
    const piUser = createdUsers.find(u => u.role === 'PI');
    if (piUser) {
      const sampleProject = new Project({
        title: 'Deep Learning for Medical Image Segmentation',
        abstract: 'This project aims to develop state-of-the-art medical image segmentation algorithms using deep learning architectures like U-Net and Transformers. We will collaborate with clinical labs to evaluate performance on real-world MRI and CT scan datasets.',
        domain: 'Machine Learning',
        status: 'Open',
        requiredSkills: ['Python', 'PyTorch', 'Computer Vision'],
        teamSizeNeeded: 3,
        owner: piUser._id,
        milestones: [
          {
            title: 'Literature review & dataset prep',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            progress: 20,
            approved: false,
          },
          {
            title: 'Model architecture implementation',
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
            progress: 0,
            approved: false,
          }
        ]
      });

      const savedProject = await sampleProject.save();
      
      // Associate project with PI
      piUser.projects.push(savedProject._id);
      await piUser.save();
      
      console.log(`Seeded project: ${savedProject.title}`);
    }

    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
