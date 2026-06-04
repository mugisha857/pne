-- DAB Enterprise Business Web Solution - Database Setup
-- Run this file in MySQL to create the database and tables

CREATE DATABASE IF NOT EXISTS dab_enterprise;
USE dab_enterprise;

-- Users table (session-based login)
CREATE TABLE IF NOT EXISTS users (
  UserID INT AUTO_INCREMENT PRIMARY KEY,
  UserName VARCHAR(100) NOT NULL UNIQUE,
  Password VARCHAR(255) NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS product (
  ProductID INT AUTO_INCREMENT PRIMARY KEY,
  ProductName VARCHAR(150) NOT NULL,
  Category VARCHAR(100) NOT NULL,
  Quantity INT NOT NULL DEFAULT 0,
  UnitPrice DECIMAL(10,2) NOT NULL,
  TotalPrice DECIMAL(10,2) NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table (many-to-one with product)
CREATE TABLE IF NOT EXISTS sales (
  SaleID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID INT NOT NULL,
  SoldQuantity INT NOT NULL,
  SoldUnitPrice DECIMAL(10,2) NOT NULL,
  SoldTotalPrice DECIMAL(10,2) NOT NULL,
  SalesDate DATE NOT NULL,
  CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES product(ProductID) ON DELETE CASCADE
);

-- StockStatus table (one-to-one with product)
CREATE TABLE IF NOT EXISTS stockstatus (
  StockID INT AUTO_INCREMENT PRIMARY KEY,
  ProductID INT NOT NULL UNIQUE,
  AvailableQuantity INT NOT NULL DEFAULT 0,
  SoldQuantity INT NOT NULL DEFAULT 0,
  RemainingQuantity INT NOT NULL DEFAULT 0,
  UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (ProductID) REFERENCES product(ProductID) ON DELETE CASCADE
);

-- Default admin user (password: Admin@1234)
-- Password is bcrypt hashed
INSERT INTO users (UserName, Password) VALUES 
('admin', '$2b$10$0V3QOna/8JWk4jRpZHTK/uW0EkvWyLWt5TynxJec8Lt8IJpEXTMze');
-- Default login: username=admin  password=Admin@1234
