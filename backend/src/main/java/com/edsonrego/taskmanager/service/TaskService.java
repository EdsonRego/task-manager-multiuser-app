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

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public Task save(Task task) {
        return taskRepository.save(task);
    }

    /**
     * 🔍 Busca dinâmica de tarefas com múltiplos filtros opcionais.
     */
    public List<Task> searchTasks(String status, String situation, Long responsibleId,
                                  LocalDate createDate, LocalDate dueDate, Long id) {
        List<Task> allTasks = taskRepository.findAll();

        return allTasks.stream()
                .filter(t -> (id == null || t.getId().equals(id)))
                .filter(t -> (status == null || status.isEmpty() ||
                        (t.getExecutionStatus() != null && t.getExecutionStatus().equalsIgnoreCase(status))))
                .filter(t -> (situation == null || situation.isEmpty() ||
                        (t.getTaskSituation() != null && t.getTaskSituation().equalsIgnoreCase(situation))))
                .filter(t -> (responsibleId == null ||
                        (t.getResponsible() != null && t.getResponsible().getId().equals(responsibleId))))
                .filter(t -> (createDate == null || (t.getCreationDate() != null && t.getCreationDate().equals(createDate))))
                .filter(t -> (dueDate == null || (t.getDueDate() != null && t.getDueDate().equals(dueDate))))
                .collect(Collectors.toList());
    }
}
