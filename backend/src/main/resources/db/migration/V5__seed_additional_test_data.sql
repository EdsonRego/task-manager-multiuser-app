-- ============================================================
-- Flyway Migration: Seed additional test data
-- Author: Edson Rego
-- Description: Adds diversified tasks for testing filters, analytics, and dashboards
-- ============================================================

-- 🧍‍♂️ Referências a usuários já existentes
-- (IDs 1–3 criados em V3__insert_sample_data.sql)

-- 🔹 Novas tarefas (vários status e situações)
INSERT INTO tasks (planned_description, executed_description, creation_date, due_date, execution_status, task_situation, responsible_id)
VALUES
-- Pendentes
('Criar plano de testes automatizados', NULL, CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP + INTERVAL '7 days', 'PENDING', 'OPEN', 1),
('Atualizar dependências do backend', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP + INTERVAL '5 days', 'PENDING', 'OPEN', 2),

-- Em execução
('Documentar endpoints REST', 'Documentação em andamento', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP + INTERVAL '2 days', 'PENDING', 'OPEN', 3),

-- Concluídas
('Refatorar módulo de autenticação', 'Refatoração concluída sem incidentes', CURRENT_TIMESTAMP - INTERVAL '10 days', CURRENT_TIMESTAMP - INTERVAL '3 days', 'DONE', 'CLOSED', 1),
('Testar integração com PostgreSQL', 'Testes bem-sucedidos', CURRENT_TIMESTAMP - INTERVAL '8 days', CURRENT_TIMESTAMP - INTERVAL '1 day', 'DONE', 'CLOSED', 2),

-- Canceladas
('Implementar notificações via e-mail', 'Cancelada por mudança de escopo', CURRENT_TIMESTAMP - INTERVAL '15 days', CURRENT_TIMESTAMP - INTERVAL '10 days', 'CANCELLED', 'CLOSED', 3),
('Ajustar layout da página de login', 'Cancelada por redesign completo', CURRENT_TIMESTAMP - INTERVAL '20 days', CURRENT_TIMESTAMP - INTERVAL '14 days', 'CANCELLED', 'CLOSED', 1);
