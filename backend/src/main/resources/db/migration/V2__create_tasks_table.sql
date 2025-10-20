CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    planned_description VARCHAR(40) NOT NULL,
    executed_description VARCHAR(40),
    creation_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    execution_status VARCHAR(20),
    task_situation VARCHAR(20),
    responsible_id BIGINT NOT NULL REFERENCES users(id)
);