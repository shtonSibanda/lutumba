-- Reset all financial data to start fresh
-- This script will clear all payments, expenses, and reset student balances to 0.00

USE school_management;

-- Clear all payment records
DELETE FROM payments;

-- Clear all expense records  
DELETE FROM expenses;

-- Clear all invoice records
DELETE FROM invoices;

-- Reset student financial balances to 0
UPDATE students SET 
    total_fees = 0.00,
    paid_amount = 0.00,
    outstanding_balance = 0.00;

-- Reset AUTO_INCREMENT counters to start fresh
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE expenses AUTO_INCREMENT = 1;
ALTER TABLE invoices AUTO_INCREMENT = 1;

-- Add confirmation message
SELECT 'All financial data has been reset to 0.00. System is ready for fresh start.' as Status;
