-- Add missing account_id and allocations fields to payments table
USE school_management;

-- Add account_id column to payments table
ALTER TABLE payments ADD COLUMN account_id VARCHAR(10) AFTER status;

-- Add allocations column to store JSON allocation data
ALTER TABLE payments ADD COLUMN allocations JSON AFTER account_id;

-- Update existing sample payments with account IDs
UPDATE payments SET account_id = '405' WHERE id IN (1, 2);
UPDATE payments SET account_id = '406' WHERE id IN (3, 4);
