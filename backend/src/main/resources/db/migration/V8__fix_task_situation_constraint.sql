-- ============================================================
-- Flyway Migration: Fix task_situation constraint
-- Author: Edson Rego
-- Description: Expands chk_tasks_situation to include all valid
--              values used by the frontend and DTOs.
-- ============================================================

-- 🔄 Remove a constraint antiga (se existir)
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS chk_tasks_situation;

-- ✅ Recria a constraint com todos os valores possíveis
ALTER TABLE tasks
ADD CONSTRAINT chk_tasks_situation
CHECK (task_situation IN ('OPEN', 'CLOSED', 'DELAYED', 'NOT DELAYED'));

-- 📈 Reforça a constraint de status para consistência
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS chk_tasks_status;
ALTER TABLE tasks
ADD CONSTRAINT chk_tasks_status
CHECK (execution_status IN ('PENDING', 'DONE', 'CANCELLED'));

-- 💡 Atualiza valores antigos inconsistentes
UPDATE tasks
SET task_situation = 'NOT DELAYED'
WHERE task_situation NOT IN ('OPEN', 'CLOSED', 'DELAYED', 'NOT DELAYED');

-- 🧾 Log de auditoria
COMMENT ON CONSTRAINT chk_tasks_situation ON tasks IS 'Permite OPEN, CLOSED, DELAYED e NOT DELAYED para compatibilidade com frontend';
COMMENT ON CONSTRAINT chk_tasks_status ON tasks IS 'Permite PENDING, DONE e CANCELLED';
