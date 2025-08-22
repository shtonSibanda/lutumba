-- Migration to remove constraints from students table
-- This allows adding students with empty or duplicate information

USE school_management;

-- Remove UNIQUE constraint from email column
ALTER TABLE students DROP INDEX email;

-- Remove UNIQUE constraint from admission_number column  
ALTER TABLE students DROP INDEX admission_number;

-- Modify columns to allow NULL values
ALTER TABLE students 
MODIFY COLUMN first_name VARCHAR(50) NULL,
MODIFY COLUMN last_name VARCHAR(50) NULL,
MODIFY COLUMN class VARCHAR(20) NULL,
MODIFY COLUMN enrollment_date DATE NULL;

-- Add a comment to document the change
ALTER TABLE students COMMENT = 'Updated to allow flexible student data entry with optional fields';
