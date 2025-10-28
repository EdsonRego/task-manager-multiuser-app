-- ============================================================
-- Flyway Migration: Update procedure recalculate_completion_rate
-- Author: Edson Rego
-- Description: Expands calculation to include delayed and on-time
--              task situations for improved reporting analytics.
-- ============================================================

-- 🔄 Remove a versão anterior, se existir
DROP FUNCTION IF EXISTS recalculate_completion_rate();

-- 🧭 Cria a nova procedure aprimorada
CREATE OR REPLACE FUNCTION recalculate_completion_rate()
RETURNS TABLE (
    user_id INT,
    responsible_name TEXT,
    total_tasks INT,
    pending_tasks INT,
    done_tasks INT,
    cancelled_tasks INT,
    open_situations INT,
    closed_situations INT,
    delayed_tasks INT,
    ontime_tasks INT,
    completion_rate NUMERIC(5,2),
    delay_rate NUMERIC(5,2)
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id AS user_id,
        CONCAT(u.first_name, ' ', u.last_name) AS responsible_name,

        -- Totais gerais
        COUNT(t.id) AS total_tasks,

        -- Status operacionais
        SUM(CASE WHEN t.execution_status = 'PENDING' THEN 1 ELSE 0 END)   AS pending_tasks,
        SUM(CASE WHEN t.execution_status = 'DONE' THEN 1 ELSE 0 END)      AS done_tasks,
        SUM(CASE WHEN t.execution_status = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled_tasks,

        -- Situações
        SUM(CASE WHEN t.task_situation = 'OPEN' THEN 1 ELSE 0 END)        AS open_situations,
        SUM(CASE WHEN t.task_situation = 'CLOSED' THEN 1 ELSE 0 END)      AS closed_situations,
        SUM(CASE WHEN t.task_situation = 'DELAYED' THEN 1 ELSE 0 END)     AS delayed_tasks,
        SUM(CASE WHEN t.task_situation = 'NOT DELAYED' THEN 1 ELSE 0 END) AS ontime_tasks,

        -- Taxas derivadas
        ROUND(
            100.0 * SUM(CASE WHEN t.execution_status = 'DONE' THEN 1 ELSE 0 END)
            / NULLIF(COUNT(t.id), 0), 2
        ) AS completion_rate,

        ROUND(
            100.0 * SUM(CASE WHEN t.task_situation = 'DELAYED' THEN 1 ELSE 0 END)
            / NULLIF(COUNT(t.id), 0), 2
        ) AS delay_rate

    FROM users u
    LEFT JOIN tasks t ON t.responsible_id = u.id
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY u.id;
END;
$$ LANGUAGE plpgsql;

-- 🧾 Log e documentação da procedure
COMMENT ON FUNCTION recalculate_completion_rate() IS
'Calcula métricas de conclusão e atraso de tarefas considerando os novos valores de task_situation.';
