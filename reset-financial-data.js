import pool from './server/config/database.js';

async function resetFinancialData() {
  let connection;
  
  try {
    console.log('🔄 Starting financial data reset...');
    
    connection = await pool.getConnection();
    
    // Clear all financial records
    await connection.execute('DELETE FROM payments');
    console.log('✅ Cleared all payments');
    
    await connection.execute('DELETE FROM expenses');
    console.log('✅ Cleared all expenses');
    
    await connection.execute('DELETE FROM invoices');
    console.log('✅ Cleared all invoices');
    
    // Reset student balances to zero
    await connection.execute(`
      UPDATE students SET 
        total_fees = 0.00,
        paid_amount = 0.00,
        outstanding_balance = 0.00
    `);
    console.log('✅ Reset all student balances to 0.00');
    
    // Reset AUTO_INCREMENT counters
    await connection.execute('ALTER TABLE payments AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE expenses AUTO_INCREMENT = 1');
    await connection.execute('ALTER TABLE invoices AUTO_INCREMENT = 1');
    console.log('✅ Reset ID counters');
    
    console.log('🎉 Financial data reset completed successfully!');
    console.log('📊 All figures are now set to zero - ready for fresh start');
    
  } catch (error) {
    console.error('❌ Error resetting financial data:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    await pool.end();
    process.exit(0);
  }
}

resetFinancialData();
