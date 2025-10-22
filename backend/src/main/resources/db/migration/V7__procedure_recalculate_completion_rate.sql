-- ============================================================
-- Flyway Migration: Procedure to recalculate completion rates
-- Author: Edson Rego
-- Description: Creates a stored procedure that recalculates task completion metrics
-- ============================================================

DROP FUNCTION IF EXISTS recalculate_completion_rate();

CREATE OR REPLACE FUNCTION recalculate_completion_rate()
RETURNS TABLE (
    user_id INT,
    responsible_name TEXT,
    total_tasks INT,
    done_tasks INT,
    completion_rate NUMERIC(5,2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS responsible_name,
        COUNT(t.id) AS total_tasks,
        SUM(CASE WHEN t.execution_status = 'DONE' THEN 1 ELSE 0 END) AS done_tasks,
        ROUND(100.0 * SUM(CASE WHEN t.execution_status = 'DONE' THEN 1 ELSE 0 END) / NULLIF(COUNT(t.id), 0), 2) AS completion_rate
    FROM users u
    LEFT JOIN tasks t ON t.responsible_id = u.id
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY u.id;
END;
$$ LANGUAGE plpgsql;
