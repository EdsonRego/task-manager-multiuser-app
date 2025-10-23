package com.edsonrego.taskmanager.service;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.repository.TaskRepository;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * 🔹 Busca paginada e filtrada de tarefas usando Specification.
     *   Substitui o antigo filtro manual com stream() por query SQL real.
     */
    public Page<Task> searchTasksPaged(
            String status,
            String situation,
            Long responsibleId,
            LocalDate createDate,
            LocalDate dueDate,
            Long id,
            String description,
            Pageable pageable
    ) {
        // Cria especificação inicial vazia
        Specification<Task> spec = Specification.where(null);

        // Aplica filtros dinamicamente, apenas se valores existirem
        if (id != null)
            spec = spec.and((root, q, cb) -> cb.equal(root.get("id"), id));

        if (status != null && !status.isBlank())
            spec = spec.and((root, q, cb) ->
                    cb.equal(cb.lower(root.get("executionStatus")), status.toLowerCase()));

        if (situation != null && !situation.isBlank())
            spec = spec.and((root, q, cb) ->
                    cb.equal(cb.lower(root.get("taskSituation")), situation.toLowerCase()));

        if (responsibleId != null)
            spec = spec.and((root, q, cb) ->
                    cb.equal(root.get("responsible").get("id"), responsibleId));

        if (createDate != null)
            spec = spec.and((root, q, cb) -> cb.equal(root.get("creationDate"), createDate));

        if (dueDate != null)
            spec = spec.and((root, q, cb) -> cb.equal(root.get("dueDate"), dueDate));

        if (description != null && !description.isBlank())
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.lower(root.get("plannedDescription")),
                            "%" + description.toLowerCase() + "%"));

        // Executa a consulta no banco com paginação e ordenação reais
        return taskRepository.findAll(spec, pageable);
    }

    /**
     * 🔹 Retorna todas as tarefas (paginadas ou não).
     *   Equivalente ao antigo findAll() mas com suporte a Pageable.
     */
    public Page<Task> findAllPaged(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    /**
     * 🔹 Busca tarefa por ID.
     */
    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * 🔹 Cria ou atualiza tarefa aplicando defaults seguros.
     */
    public Task save(Task task) {
        if (task.getExecutionStatus() == null || task.getExecutionStatus().isBlank())
            task.setExecutionStatus("PENDING");

        if (task.getTaskSituation() == null || task.getTaskSituation().isBlank())
            task.setTaskSituation("OPEN");

        if (task.getCreationDate() == null)
            task.setCreationDate(LocalDate.now());

        return taskRepository.save(task);
    }

    /**
     * 🔹 Exclui tarefa pelo ID.
     */
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
