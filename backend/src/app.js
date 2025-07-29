require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const todoRoutes = require('./routes/todos');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend is running locally'
  });
});

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Todo Backend API is running!' });
});

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://mongodb:27017/todoapp';
console.log('Connecting to MongoDB:', mongoUri);

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('🔄 Retrying connection in 5 seconds...');
  setTimeout(() => {
    process.exit(1);
  }, 5000);
});