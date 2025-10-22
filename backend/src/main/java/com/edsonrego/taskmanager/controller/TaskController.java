package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // 🔹 Retorna todas as tarefas
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> tasks = taskService.findAll();
        if (tasks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(tasks);
    }

    // 🔹 Busca uma tarefa pelo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.findById(id);
        return task.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Task not found"));
    }

    // 🔹 Cria nova tarefa
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        if (task.getPlannedDescription() == null || task.getPlannedDescription().isBlank()) {
            return ResponseEntity.badRequest().body("Planned description is required.");
        }

        Task saved = taskService.save(task);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Atualiza tarefa existente
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        Optional<Task> existing = taskService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Task not found");
        }

        Task task = existing.get();
        if (updatedTask.getPlannedDescription() != null)
            task.setPlannedDescription(updatedTask.getPlannedDescription());
        if (updatedTask.getExecutedDescription() != null)
            task.setExecutedDescription(updatedTask.getExecutedDescription());
        if (updatedTask.getExecutionStatus() != null)
            task.setExecutionStatus(updatedTask.getExecutionStatus());
        if (updatedTask.getTaskSituation() != null)
            task.setTaskSituation(updatedTask.getTaskSituation());
        if (updatedTask.getDueDate() != null)
            task.setDueDate(updatedTask.getDueDate());
        if (updatedTask.getResponsible() != null)
            task.setResponsible(updatedTask.getResponsible());

        Task saved = taskService.save(task);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Pesquisa dinâmica de tarefas com múltiplos filtros opcionais
    @GetMapping("/search")
    public ResponseEntity<?> searchTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String situation,
            @RequestParam(required = false) Long responsibleId,
            @RequestParam(required = false) String creationDate,
            @RequestParam(required = false) String dueDate,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String description
    ) {
        try {
            LocalDateTime creation = (creationDate != null && !creationDate.isBlank())
                    ? LocalDateTime.parse(creationDate)
                    : null;
            LocalDateTime due = (dueDate != null && !dueDate.isBlank())
                    ? LocalDateTime.parse(dueDate)
                    : null;

            List<Task> results = taskService.searchTasks(status, situation, responsibleId, creation, due, id, description);
            if (results.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(results);

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use ISO-8601 format (e.g., 2025-10-21T10:30:00).");
        }
    }

    // 🔹 Exclui uma tarefa pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        Optional<Task> existing = taskService.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.status(404).body("Task not found");
        }
        taskService.delete(id);
        return ResponseEntity.ok("Task deleted successfully.");
    }
}
