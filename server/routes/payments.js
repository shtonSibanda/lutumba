import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM payments 
      ORDER BY payment_date DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get payments by student ID
router.get('/student/:studentId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * FROM payments 
      WHERE student_id = ?
      ORDER BY payment_date DESC
    `, [req.params.studentId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching student payments:', error);
    res.status(500).json({ error: 'Failed to fetch student payments' });
  }
});

// Create new payment
router.post('/', async (req, res) => {
  try {
    const {
      studentId, studentName, amount, currency, paymentMethod,
      paymentDate, description, invoiceNumber, status, accountId, allocations
    } = req.body;

    // First, check if account_id column exists, if not add it
    try {
      await pool.query('ALTER TABLE payments ADD COLUMN account_id VARCHAR(10) AFTER status');
      await pool.query('ALTER TABLE payments ADD COLUMN allocations JSON AFTER account_id');
    } catch (error) {
      // Column already exists, continue
    }

    const [result] = await pool.query(`
      INSERT INTO payments (
        student_id, student_name, amount, currency, payment_method,
        payment_date, description, invoice_number, status, account_id, allocations
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      studentId, studentName, amount, currency, paymentMethod,
      paymentDate, description, invoiceNumber, status || 'completed',
      accountId || null, allocations ? JSON.stringify(allocations) : null
    ]);

    // Update student's paid amount and outstanding balance
    const [studentResult] = await pool.query(`
      SELECT paid_amount, total_fees FROM students WHERE id = ?
    `, [studentId]);

    if (studentResult.length > 0) {
      const currentPaidAmount = parseFloat(studentResult[0].paid_amount) || 0;
      const totalFees = parseFloat(studentResult[0].total_fees) || 0;
      const newPaidAmount = currentPaidAmount + parseFloat(amount);
      const outstandingBalance = Math.max(0, totalFees - newPaidAmount);

      await pool.query(`
        UPDATE students SET 
          paid_amount = ?, 
          outstanding_balance = ?
        WHERE id = ?
      `, [newPaidAmount, outstandingBalance, studentId]);
    }

    res.status(201).json({ 
      message: 'Payment created successfully',
      paymentId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// Update payment
router.put('/:id', async (req, res) => {
  try {
    const {
      studentId, studentName, amount, currency, paymentMethod,
      paymentDate, description, invoiceNumber, status, accountId, allocations
    } = req.body;

    // Get old payment amount for balance adjustment
    const [oldPayment] = await pool.query(`
      SELECT amount FROM payments WHERE id = ?
    `, [req.params.id]);

    await pool.query(`
      UPDATE payments SET
        student_id = ?, student_name = ?, amount = ?, currency = ?,
        payment_method = ?, payment_date = ?, description = ?,
        invoice_number = ?, status = ?, account_id = ?, allocations = ?
      WHERE id = ?
    `, [
      studentId, studentName, amount, currency, paymentMethod,
      paymentDate, description, invoiceNumber, status,
      accountId || null, allocations ? JSON.stringify(allocations) : null,
      req.params.id
    ]);

    // Update student balance if amount changed
    if (oldPayment.length > 0 && oldPayment[0].amount !== amount) {
      const [studentResult] = await pool.query(`
        SELECT paid_amount, total_fees FROM students WHERE id = ?
      `, [studentId]);

      if (studentResult.length > 0) {
        const currentPaidAmount = parseFloat(studentResult[0].paid_amount) || 0;
        const totalFees = parseFloat(studentResult[0].total_fees) || 0;
        const oldAmount = parseFloat(oldPayment[0].amount) || 0;
        const newAmount = parseFloat(amount) || 0;
        
        const adjustedPaidAmount = currentPaidAmount - oldAmount + newAmount;
        const outstandingBalance = Math.max(0, totalFees - adjustedPaidAmount);

        await pool.query(`
          UPDATE students SET 
            paid_amount = ?, 
            outstanding_balance = ?
          WHERE id = ?
        `, [adjustedPaidAmount, outstandingBalance, studentId]);
      }
    }

    res.json({ message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Failed to update payment' });
  }
});

// Delete payment
router.delete('/:id', async (req, res) => {
  try {
    // Get payment details before deletion
    const [payment] = await pool.query(`
      SELECT student_id, amount FROM payments WHERE id = ?
    `, [req.params.id]);

    if (payment.length > 0) {
      const studentId = payment[0].student_id;
      const amount = parseFloat(payment[0].amount) || 0;

      // Delete the payment
      await pool.query('DELETE FROM payments WHERE id = ?', [req.params.id]);

      // Update student balance
      const [studentResult] = await pool.query(`
        SELECT paid_amount, total_fees FROM students WHERE id = ?
      `, [studentId]);

      if (studentResult.length > 0) {
        const currentPaidAmount = parseFloat(studentResult[0].paid_amount) || 0;
        const totalFees = parseFloat(studentResult[0].total_fees) || 0;
        const newPaidAmount = Math.max(0, currentPaidAmount - amount);
        const outstandingBalance = Math.max(0, totalFees - newPaidAmount);

        await pool.query(`
          UPDATE students SET 
            paid_amount = ?, 
            outstanding_balance = ?
          WHERE id = ?
        `, [newPaidAmount, outstandingBalance, studentId]);
      }
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

// Get daily payments
router.get('/daily/today', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(`
      SELECT * FROM payments 
      WHERE DATE(payment_date) = ?
      ORDER BY payment_date DESC
    `, [today]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching daily payments:', error);
    res.status(500).json({ error: 'Failed to fetch daily payments' });
  }
});

export default router; 