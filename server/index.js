import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { testConnection } from './config/database.js';

// Get directory name for ES module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables from config.env in project root
dotenv.config({ path: join(__dirname, '..', 'config.env') });

// Import routes
import studentsRouter from './routes/students.js';
import paymentsRouter from './routes/payments.js';

// Load environment variables
dotenv.config({ path: '../config.env' });
console.log('Environment file path:', '../config.env');
console.log('Loaded DB_USER:', process.env.DB_USER);
console.log('Loaded DB_PASSWORD:', process.env.DB_PASSWORD);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
testConnection();

// API Routes
app.use('/api/students', studentsRouter);
app.use('/api/payments', paymentsRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'School Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});