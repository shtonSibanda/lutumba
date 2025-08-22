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
import expensesRouter from './routes/expenses.js';
import pool from './config/database.js';

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
app.use('/api/expenses', expensesRouter);

// Reset financial data endpoint (password protected)
app.post('/api/reset-financial-data', async (req, res) => {
  const { password } = req.body;
  
  // Verify password
  if (password !== 'ashtechlutumba25@') {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    
    // Clear all financial records
    await connection.execute('DELETE FROM payments');
    await connection.execute('DELETE FROM expenses');
    await connection.execute('DELETE FROM invoices');
    
    // Reset student balances to zero
    await connection.execute(`
      UPDATE students SET 
        total_fees = 0.00,
        paid_amount = 0.00,
        outstanding_balance = 0.00
    `);
    
    // Reset AUTO_INCREMENT counters
    await connection.execute('ALTER TABLE payments AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE expenses AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE invoices AUTO_INCREMENT = 1');
    
    res.json({ 
      success: true,
      message: 'All financial data has been reset to zero'
    });
    
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ 
      error: 'Failed to reset financial data',
      message: error.message 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Fix payment account IDs based on new naming scheme
app.post('/api/fix-payment-accounts', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // First, create temporary mappings to avoid conflicts
    // Step 1: Move old IDs to temporary values
    await connection.execute(`
      UPDATE payments 
      SET account_id = 'temp_405' 
      WHERE account_id = '405'
    `);
    
    await connection.execute(`
      UPDATE payments 
      SET account_id = 'temp_406' 
      WHERE account_id = '406'
    `);
    
    await connection.execute(`
      UPDATE payments 
      SET account_id = 'temp_408' 
      WHERE account_id = '408'
    `);
    
    // Step 2: Map to new IDs
    // temp_405 (old tuition) -> 406 (new tuition)
    await connection.execute(`
      UPDATE payments 
      SET account_id = '406' 
      WHERE account_id = 'temp_405'
    `);
    
    // temp_406 (old projects) -> 408 (new projects)  
    await connection.execute(`
      UPDATE payments 
      SET account_id = '408' 
      WHERE account_id = 'temp_406'
    `);
    
    // temp_408 (old nostro) -> 405 (new nostro)
    await connection.execute(`
      UPDATE payments 
      SET account_id = '405' 
      WHERE account_id = 'temp_408'
    `);
    
    // Also update based on invoice number pattern if account_id is missing
    await connection.execute(`
      UPDATE payments 
      SET account_id = SUBSTRING_INDEX(invoice_number, '-', 1) 
      WHERE invoice_number LIKE '%-%' AND (account_id IS NULL OR account_id = '')
    `);
    
    // Update expenses with old account IDs to new ones using same temp approach
    await connection.execute(`
      UPDATE expenses 
      SET account_id = 'temp_405' 
      WHERE account_id = '405'
    `);
    
    await connection.execute(`
      UPDATE expenses 
      SET account_id = 'temp_406' 
      WHERE account_id = '406'
    `);
    
    await connection.execute(`
      UPDATE expenses 
      SET account_id = 'temp_408' 
      WHERE account_id = '408'
    `);
    
    // Map expenses to new IDs
    await connection.execute(`
      UPDATE expenses 
      SET account_id = '406' 
      WHERE account_id = 'temp_405'
    `);
    
    await connection.execute(`
      UPDATE expenses 
      SET account_id = '408' 
      WHERE account_id = 'temp_406'
    `);
    
    await connection.execute(`
      UPDATE expenses 
      SET account_id = '405' 
      WHERE account_id = 'temp_408'
    `);
    
    // Get updated payments and expenses
    const [payments] = await connection.execute('SELECT * FROM payments');
    const [expenses] = await connection.execute('SELECT * FROM expenses');
    
    res.json({ 
      success: true,
      message: 'Payment and expense account IDs updated to new naming scheme',
      payments: payments,
      expenses: expenses
    });
    
  } catch (error) {
    console.error('Fix error:', error);
    res.status(500).json({ 
      error: 'Failed to fix payment accounts',
      message: error.message 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

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