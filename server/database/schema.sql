-- School Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Users table for authentication
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'finance') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    phone VARCHAR(20),
    class VARCHAR(20),
    status ENUM('active', 'inactive', 'graduated', 'transferred') DEFAULT 'active',
    enrollment_date DATE,
    total_fees DECIMAL(10,2) DEFAULT 0.00,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    outstanding_balance DECIMAL(10,2) DEFAULT 0.00,
    address TEXT,
    parent_name VARCHAR(100),
    parent_phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    admission_number VARCHAR(20),
    date_of_admission DATE,
    academic_year VARCHAR(10),
    medical_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student documents table
CREATE TABLE student_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Fee structures table
CREATE TABLE fee_structures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    class VARCHAR(20) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Fee items table
CREATE TABLE fee_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fee_structure_id INT NOT NULL,
    description VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency ENUM('USD', 'ZAR', 'ZIG') DEFAULT 'USD',
    payment_method ENUM('cash', 'card', 'bank_transfer', 'check') NOT NULL,
    payment_date DATE NOT NULL,
    description TEXT,
    invoice_number VARCHAR(50),
    status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Invoices table
CREATE TABLE invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency ENUM('USD', 'ZAR', 'ZIG') DEFAULT 'USD',
    due_date DATE NOT NULL,
    status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Attendance records table
CREATE TABLE attendance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_date (student_id, date)
);

-- Staff table
CREATE TABLE staff (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('teacher', 'admin', 'finance', 'principal') NOT NULL,
    position VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Staff attendance records table
CREATE TABLE staff_attendance_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('present', 'absent', 'late') NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE CASCADE,
    UNIQUE KEY unique_staff_date (staff_id, date)
);

-- Exam results table
CREATE TABLE exam_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    subject VARCHAR(50) NOT NULL,
    term VARCHAR(20) NOT NULL,
    year INT NOT NULL,
    score DECIMAL(5,2) NOT NULL,
    max_score DECIMAL(5,2) NOT NULL,
    teacher_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Expenses table
CREATE TABLE expenses (
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

-- System settings table
CREATE TABLE system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    address TEXT,
    academic_year VARCHAR(10),
    current_term VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@school.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default system settings
INSERT INTO system_settings (school_name, contact_email, academic_year, current_term) VALUES 
('Lutumba Adventist Secondary School', 'admin@lutumba.edu', '2024-2025', 'Term 1'); 