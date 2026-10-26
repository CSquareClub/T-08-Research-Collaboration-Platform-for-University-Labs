const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
const PORT = process.env.PORT || 5000;

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Basic Route
app.get('/', (req, res) => {
  res.send('ResearchHub API is running');
});

// Database connection with connection caching for serverless environments
let isConnected = false;
const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }
  try {
    if (process.env.MONGO_URI) {
      const db = await mongoose.connect(process.env.MONGO_URI);
      isConnected = db.connections[0].readyState >= 1;
      console.log('✅ MongoDB Connected successfully');
    } else {
      console.warn('⚠️ MONGO_URI is not defined. Skipping database connection for now.');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message || error);
    if (error.code === 'ENOTFOUND' || error.syscall === 'querySrv') {
      console.error('\n💡 Troubleshooting "querySrv ENOTFOUND":');
      console.error('1. The cluster hostname in MONGO_URI does not exist or has a typo.');
      console.error('2. Go to MongoDB Atlas (cloud.mongodb.com) -> Cluster -> "Connect" -> "Drivers" to copy your latest URI.');
      console.error('3. Make sure Network Access in Atlas includes your current IP or 0.0.0.0/0 (allow from anywhere).\n');
    }
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

// Ensure database connection before processing API requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/projects', require('./routes/projects.routes'));
app.use('/api/collaboration-requests', require('./routes/collaboration.routes'));
app.use('/api/datasets', require('./routes/datasets.routes'));
app.use('/api/publications', require('./routes/publications.routes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// When running standalone (local development)
if (require.main === module) {
  connectDB();

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Users join a room with their user ID to receive direct notifications
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
