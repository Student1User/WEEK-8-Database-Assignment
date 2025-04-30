-- ============================================
-- Library Management System SQL Script
-- ============================================
-- This script creates a complete relational database
-- for managing a library system, including:
--   - Book and author records
--   - Book categorization
--   - Library members and staff
--   - Loan tracking
-- The database uses proper constraints and relationships.
-- ============================================

-- STEP 1: Create the database
CREATE DATABASE library_db;

-- Select the database
USE library_db;

-- ============================================
-- STEP 2: Create Tables
-- ============================================

-- Authors Table
-- Stores information about book authors
CREATE TABLE authors (
    author_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL
);

-- Categories Table
-- Stores unique book genres/categories
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Books Table
-- Stores book details and links each book to a category
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    isbn VARCHAR(13) NOT NULL UNIQUE,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);

-- Book_Author Table
-- Many-to-Many relationship between books and authors
CREATE TABLE book_author (
    book_id INT,
    author_id INT,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (author_id) REFERENCES authors(author_id)
);

-- Members Table
-- Stores information about people who borrow books
CREATE TABLE members (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Staff Table
-- Stores information about library staff who handle loans
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Loans Table
-- Stores records of book borrowings and returns
CREATE TABLE loans (
    loan_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    member_id INT NOT NULL,
    staff_id INT NOT NULL,
    loan_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    FOREIGN KEY (book_id) REFERENCES books(book_id),
    FOREIGN KEY (member_id) REFERENCES members(member_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

-- ============================================
-- STEP 3: Insert Sample Data
-- ============================================

-- Insert sample authors
INSERT INTO authors (first_name, last_name) VALUES
('George', 'Orwell'),
('J.K.', 'Rowling'),
('Chinua', 'Achebe');

-- Insert sample categories
INSERT INTO categories (name) VALUES
('Fiction'),
('Fantasy'),
('Historical');

-- Insert sample books
INSERT INTO books (title, isbn, category_id) VALUES
('1984', '9780451524935', 1),
('Harry Potter and the Sorcerer\'s Stone', '9780439708180', 2),
('Things Fall Apart', '9780385474542', 3);

-- Map books to authors
INSERT INTO book_author (book_id, author_id) VALUES
(1, 1), -- 1984 by George Orwell
(2, 2), -- Harry Potter by J.K. Rowling
(3, 3); -- Things Fall Apart by Chinua Achebe

-- Insert sample library members
INSERT INTO members (first_name, last_name, email) VALUES
('Alice', 'Wanjiku', 'alice@example.com'),
('Brian', 'Otieno', 'brian@example.com');

-- Insert sample library staff
INSERT INTO staff (name, email) VALUES
('Susan M.', 'susan@library.com'),
('David K.', 'david@library.com');

-- Insert sample loan records
INSERT INTO loans (book_id, member_id, staff_id, loan_date, due_date, return_date) VALUES
(1, 1, 1, '2025-04-15', '2025-04-22', NULL),
(2, 2, 2, '2025-04-10', '2025-04-17', '2025-04-16');

-- ============================================
-- End of Script
-- ============================================
