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
     *   Comparação de data ignora hora (usa DATE()).
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
        Specification<Task> spec = Specification.where(null);

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

        // ✅ Corrigido: compara apenas a data, ignora hora
        if (createDate != null)
            spec = spec.and((root, q, cb) ->
                    cb.equal(cb.function("DATE", LocalDate.class, root.get("creationDate")), createDate));

        if (dueDate != null)
            spec = spec.and((root, q, cb) ->
                    cb.equal(cb.function("DATE", LocalDate.class, root.get("dueDate")), dueDate));

        if (description != null && !description.isBlank())
            spec = spec.and((root, q, cb) ->
                    cb.like(cb.lower(root.get("plannedDescription")),
                            "%" + description.toLowerCase() + "%"));

        return taskRepository.findAll(spec, pageable);
    }

    public Page<Task> findAllPaged(Pageable pageable) {
        return taskRepository.findAll(pageable);
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public Task save(Task task) {
        if (task.getResponsible() == null) {
            throw new IllegalArgumentException("Responsible user must be defined.");
        }

        if (task.getExecutionStatus() == null || task.getExecutionStatus().isBlank())
            task.setExecutionStatus("PENDING");

        if (task.getTaskSituation() == null || task.getTaskSituation().isBlank())
            task.setTaskSituation("OPEN");

        if (task.getCreationDate() == null)
            task.setCreationDate(LocalDate.now());

        return taskRepository.save(task);
    }

    public void delete(Long id) {
        taskRepository.deleteById(id);
    }
}
