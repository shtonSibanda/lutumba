import express from 'express';
import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

const router = express.Router();

// Initialize expenses table if it doesn't exist
const initializeExpensesTable = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        description TEXT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        currency ENUM('USD', 'ZAR', 'ZiG') DEFAULT 'USD',
        category VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        payment_method ENUM('cash', 'check', 'bank_transfer') NOT NULL,
        account_id VARCHAR(10),
        allocation_category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    await connection.end();
    console.log('✅ Expenses table initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize expenses table:', error);
  }
};

// Initialize table on module load
initializeExpensesTable();

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM expenses ORDER BY created_at DESC'
    );
    await connection.end();
    res.json(rows);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT * FROM expenses WHERE id = ?',
      [id]
    );
    await connection.end();
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Failed to fetch expense' });
  }
});

// Create new expense
router.post('/', async (req, res) => {
  try {
    const {
      description,
      amount,
      currency,
      category,
      date,
      paymentMethod,
      accountId,
      allocationCategory
    } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      `INSERT INTO expenses (
        description, amount, currency, category, date, payment_method, 
        account_id, allocation_category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [description, amount, currency, category, date, paymentMethod, accountId, allocationCategory]
    );
    await connection.end();

    res.status(201).json({
      expenseId: result.insertId,
      message: 'Expense created successfully'
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Failed to create expense' });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      amount,
      currency,
      category,
      date,
      paymentMethod,
      accountId,
      allocationCategory
    } = req.body;

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      `UPDATE expenses SET 
        description = ?, amount = ?, currency = ?, category = ?, 
        date = ?, payment_method = ?, account_id = ?, allocation_category = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`,
      [description, amount, currency, category, date, paymentMethod, accountId, allocationCategory, id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense updated successfully' });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Failed to update expense' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'DELETE FROM expenses WHERE id = ?',
      [id]
    );
    await connection.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
