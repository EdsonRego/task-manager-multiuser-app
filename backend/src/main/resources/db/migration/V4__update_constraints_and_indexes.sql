-- ============================================================
-- Flyway Migration: Update constraints and indexes
-- Author: Edson Rego
-- Description: Adds unique constraints, defaults, and performance indexes
-- ============================================================

-- 🔒 Garante unicidade e consistência nos usuários
ALTER TABLE users
    ALTER COLUMN first_name SET NOT NULL,
    ALTER COLUMN last_name  SET NOT NULL,
    ALTER COLUMN email      SET NOT NULL,
    ALTER COLUMN password   SET NOT NULL,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;

-- ✅ Evita e-mails duplicados
ALTER TABLE users
    ADD CONSTRAINT uq_users_email UNIQUE (email);

-- ⚙️ Cria índices úteis para busca por nome e e-mail
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_name  ON users (last_name, first_name);

-- 🧩 Atualiza colunas da tabela tasks para consistência
ALTER TABLE tasks
    ALTER COLUMN planned_description SET NOT NULL,
    ALTER COLUMN execution_status SET DEFAULT 'PENDING',
    ALTER COLUMN task_situation SET DEFAULT 'OPEN',
    ADD CONSTRAINT chk_tasks_status CHECK (execution_status IN ('PENDING', 'DONE', 'CANCELLED')),
    ADD CONSTRAINT chk_tasks_situation CHECK (task_situation IN ('OPEN', 'CLOSED'));

-- ⚡ Índices adicionais para performance
CREATE INDEX IF NOT EXISTS idx_tasks_status       ON tasks (execution_status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date     ON tasks (due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_creation_date ON tasks (creation_date);
