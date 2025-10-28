package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.TaskService;
import com.edsonrego.taskmanager.service.UserService;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    public TaskController(TaskService taskService, UserService userService) {
        this.taskService = taskService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "false") boolean paged
    ) {
        Sort sort = direction.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        return !paged
                ? ResponseEntity.ok(taskService.findAllPaged(Pageable.unpaged()).getContent())
                : ResponseEntity.ok(taskService.findAllPaged(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        return taskService.findById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Task not found"));
    }

    /**
     * 🔹 Create a new task using the authenticated user as responsible.
     */
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task, Authentication authentication) {
        if (task.getPlannedDescription() == null || task.getPlannedDescription().isBlank()) {
            return ResponseEntity.badRequest().body("Planned description is required.");
        }

        if (authentication == null || !authentication.isAuthenticated()) {
            System.out.println("⚠️ Authentication missing or invalid!");
            return ResponseEntity.status(401).body("User not authenticated.");
        }

        String email = authentication.getName();
        User responsibleUser = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: " + email));

        task.setResponsible(responsibleUser);
        if (task.getExecutionStatus() != null)
            task.setExecutionStatus(task.getExecutionStatus().toUpperCase());
        if (task.getCreationDate() == null)
            task.setCreationDate(LocalDate.now());

        Task saved = taskService.save(task);
        System.out.println("💾 Task created successfully by " + responsibleUser.getEmail());
        return ResponseEntity.ok(saved);
    }

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

        Task saved = taskService.save(task);
        return ResponseEntity.ok(saved);
    }

    /**
     * 🔎 Busca tarefas considerando apenas a data (ignorando hora)
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String situation,
            @RequestParam(required = false) Long responsibleId,
            @RequestParam(required = false) String creationDate,
            @RequestParam(required = false) String dueDate,
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) String description,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "false") boolean paged
    ) {
        try {
            LocalDate creation = (creationDate != null && !creationDate.isBlank())
                    ? LocalDate.parse(creationDate)
                    : null;
            LocalDate due = (dueDate != null && !dueDate.isBlank())
                    ? LocalDate.parse(dueDate)
                    : null;

            Sort sort = direction.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();

            Pageable pageable = paged ? PageRequest.of(page, size, sort) : Pageable.unpaged();

            var results = taskService.searchTasksPaged(
                    status, situation, responsibleId,
                    creation, due, id, description, pageable
            );

            if (results.isEmpty()) return ResponseEntity.noContent().build();
            return ResponseEntity.ok(results);

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid date format. Use ISO format (e.g., 2025-10-21).");
        }
    }

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
