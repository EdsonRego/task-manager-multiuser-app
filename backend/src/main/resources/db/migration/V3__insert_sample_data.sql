-- ============================================================
-- Flyway Migration: Insert sample data
-- Author: Edson Rego
-- Description: Adds sample users and tasks for development/testing
-- ============================================================

-- 🔹 Usuários de exemplo
INSERT INTO users (first_name, last_name, email, password, created_at)
VALUES
('Edson', 'Rego', 'edsonxrego@gmail.com', '$2a$10$KIX7f2vIYkxi7dP4M4SdHeT4H1vRkYQbzq76Pzmx40uwRgfbDXROK', CURRENT_TIMESTAMP), -- senha: 123456
('Maria', 'Silva', 'maria.silva@example.com', '$2a$10$KIX7f2vIYkxi7dP4M4SdHeT4H1vRkYQbzq76Pzmx40uwRgfbDXROK', CURRENT_TIMESTAMP), -- senha: 123456
('João', 'Souza', 'joao.souza@example.com', '$2a$10$KIX7f2vIYkxi7dP4M4SdHeT4H1vRkYQbzq76Pzmx40uwRgfbDXROK', CURRENT_TIMESTAMP);  -- senha: 123456


-- 🔹 Tarefas de exemplo
INSERT INTO tasks (planned_description, executed_description, creation_date, due_date, execution_status, task_situation, responsible_id)
VALUES
('Preparar relatório mensal', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '10 days', 'PENDING', 'OPEN', 1),
('Revisar documentação técnica', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '5 days', 'PENDING', 'OPEN', 2),
('Testar integração com o frontend', 'Integração concluída com sucesso', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '2 days', 'DONE', 'CLOSED', 3);
