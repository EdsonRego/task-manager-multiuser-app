-- ============================================================
-- Flyway Migration: Create view vw_tasks_summary
-- Author: Edson Rego
-- Description: Creates a summarized analytical view for dashboards and reporting
-- ============================================================

-- 🔄 Remove a view antiga (se existir)
DROP VIEW IF EXISTS vw_tasks_summary;

-- 🧭 Criação da nova view consolidada
CREATE OR REPLACE VIEW vw_tasks_summary AS
SELECT
    u.id AS user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS responsible_name,
    COUNT(t.id) AS total_tasks,
    SUM(CASE WHEN t.execution_status = 'PENDING' THEN 1 ELSE 0 END) AS pending_tasks,
    SUM(CASE WHEN t.execution_status = 'DONE' THEN 1 ELSE 0 END) AS done_tasks,
    SUM(CASE WHEN t.execution_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_tasks,
    SUM(CASE WHEN t.task_situation = 'OPEN' THEN 1 ELSE 0 END) AS open_situations,
    SUM(CASE WHEN t.task_situation = 'CLOSED' THEN 1 ELSE 0 END) AS closed_situations,
    ROUND(100.0 * SUM(CASE WHEN t.execution_status = 'DONE' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0), 2) AS completion_rate
FROM users u
LEFT JOIN tasks t ON t.responsible_id = u.id
GROUP BY u.id, u.first_name, u.last_name
ORDER BY u.id;

-- 📈 Índice opcional para melhorar desempenho de joins e filtros
CREATE INDEX IF NOT EXISTS idx_tasks_responsible_id ON tasks (responsible_id);
