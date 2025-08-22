// Direct database update to fix the payment accountId
import pool from './server/config/database.js';

async function updatePaymentAccount() {
  try {
    // Update the existing payment to have account_id = '405' based on invoice number
    const [result] = await pool.query(`
      UPDATE payments 
      SET account_id = '405' 
      WHERE invoice_number LIKE '405-%'
    `);
    
    console.log('Updated payments:', result.affectedRows);
    
    // Fetch the updated payment to verify
    const [payments] = await pool.query('SELECT * FROM payments ORDER BY id DESC LIMIT 1');
    console.log('Updated payment:', payments[0]);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating payment:', error);
    process.exit(1);
  }
}

updatePaymentAccount();
