USE school_management;

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
);
