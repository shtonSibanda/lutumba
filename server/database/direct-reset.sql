USE school_management;

-- Clear all financial data
TRUNCATE TABLE payments;
TRUNCATE TABLE expenses; 
TRUNCATE TABLE invoices;

-- Reset student balances
UPDATE students SET 
    total_fees = 0.00,
    paid_amount = 0.00,
    outstanding_balance = 0.00;

-- Show confirmation
SELECT 'Data reset completed' as message;
