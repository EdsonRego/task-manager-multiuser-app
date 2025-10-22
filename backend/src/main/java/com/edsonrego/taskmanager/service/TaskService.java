package com.edsonrego.taskmanager.service;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * 🔹 Retorna todas as tarefas cadastradas.
     */
    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    /**
     * 🔹 Busca tarefa por ID.
     */
    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    /**
     * 🔹 Cria ou atualiza uma tarefa aplicando defaults seguros.
     */
    public Task save(Task task) {
        // Define status padrão se não informado
        if (task.getExecutionStatus() == null || task.getExecutionStatus().isBlank()) {
            task.setExecutionStatus("PENDING");
        }

        // Define situação padrão se não informada
        if (task.getTaskSituation() == null || task.getTaskSituation().isBlank()) {
            task.setTaskSituation("OPEN");
        }

        // Define data de criação se ausente
        if (task.getCreationDate() == null) {
            task.setCreationDate(LocalDate.now());
        }

        return taskRepository.save(task);
    }

    /**
     * 🔹 Remove uma tarefa pelo ID.
     */
    public void delete(Long id) {
        taskRepository.deleteById(id);
    }

    /**
     * 🔍 Busca dinâmica de tarefas com múltiplos filtros opcionais.
     */
    public List<Task> searchTasks(
            String status,
            String situation,
            Long responsibleId,
            LocalDate createDate,
            LocalDate dueDate,
            Long id,
            String description
    ) {
        List<Task> allTasks = taskRepository.findAll();

        return allTasks.stream()
                .filter(t -> (id == null || t.getId().equals(id)))
                .filter(t -> (status == null || status.isBlank() ||
                        (t.getExecutionStatus() != null && t.getExecutionStatus().equalsIgnoreCase(status))))
                .filter(t -> (situation == null || situation.isBlank() ||
                        (t.getTaskSituation() != null && t.getTaskSituation().equalsIgnoreCase(situation))))
                .filter(t -> (responsibleId == null ||
                        (t.getResponsible() != null && t.getResponsible().getId().equals(responsibleId))))
                .filter(t -> (createDate == null ||
                        (t.getCreationDate() != null && t.getCreationDate().isEqual(createDate))))
                .filter(t -> (dueDate == null ||
                        (t.getDueDate() != null && t.getDueDate().isEqual(dueDate))))
                .filter(t -> (description == null || description.isBlank() ||
                        (t.getPlannedDescription() != null &&
                                t.getPlannedDescription().toLowerCase().contains(description.toLowerCase()))))
                .collect(Collectors.toList());
    }
}
