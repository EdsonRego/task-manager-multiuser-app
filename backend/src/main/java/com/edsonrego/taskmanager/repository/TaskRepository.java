package com.edsonrego.taskmanager.repository;

import com.edsonrego.taskmanager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Repositório de tarefas.
 *
 * 🔹 Agora implementa JpaSpecificationExecutor para permitir
 *     - Filtros dinâmicos (WHERE condicional)
 *     - Paginação real via Pageable
 *     - Ordenação no banco de dados
 */
public interface TaskRepository extends JpaRepository<Task, Long>, JpaSpecificationExecutor<Task> {
}
