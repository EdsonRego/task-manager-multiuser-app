-- ============================================================
-- Flyway Migration: Create tasks table
-- Author: Edson Rego
-- Description: Creates the 'tasks' table with user relationship
-- ============================================================

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    planned_description TEXT NOT NULL,
    executed_description TEXT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    execution_status VARCHAR(20) DEFAULT 'PENDING',
    task_situation VARCHAR(20) DEFAULT 'OPEN',
    responsible_id INTEGER,
    CONSTRAINT fk_tasks_user
        FOREIGN KEY (responsible_id)
        REFERENCES users(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- Index for faster lookups by user
CREATE INDEX IF NOT EXISTS idx_tasks_responsible_id ON tasks(responsible_id);
