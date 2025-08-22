@echo off
echo Resetting financial data...
mysql -u root -p -e "USE school_management; DELETE FROM payments; DELETE FROM expenses; DELETE FROM invoices; UPDATE students SET total_fees = 0.00, paid_amount = 0.00, outstanding_balance = 0.00; ALTER TABLE payments AUTO_INCREMENT = 1; ALTER TABLE expenses AUTO_INCREMENT = 1; ALTER TABLE invoices AUTO_INCREMENT = 1; SELECT 'Financial data reset complete' as Status;"
echo Reset complete!
pause
