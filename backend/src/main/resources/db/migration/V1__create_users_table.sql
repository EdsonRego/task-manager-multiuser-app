-- ============================================================
-- Flyway Migration: Create users table
-- Author: Edson Rego
-- Description: Creates the 'users' table with secure password field
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name  VARCHAR(50) NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255) NOT NULL,        -- BCrypt hash (≈60 chars)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
