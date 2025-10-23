package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.TaskService;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:5173")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * 🔹 Lista todas as tarefas (compatível com o endpoint atual)
     *    - Se paged=false → retorna lista completa
     *    - Se paged=true  → retorna Page<Task> paginado e ordenado
     */
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

        // 🔹 Se "paged=false", devolve todos os registros
        if (!paged) {
            return ResponseEntity.ok(taskService.findAllPaged(Pageable.unpaged()).getContent());
        }

        // 🔹 Caso contrário, devolve paginação real
        return ResponseEntity.ok(taskService.findAllPaged(pageable));
    }

    /**
     * 🔹 Busca uma tarefa específica pelo ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.findById(id);
        return task.<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Task not found"));
    }

    /**
     * 🔹 Cria nova tarefa (responsável = usuário autenticado, se existir)
     */
    @PostMapping
    public ResponseEntity<?> createTask(@AuthenticationPrincipal User authenticatedUser,
                                        @RequestBody Task task) {
        if (task.getPlannedDescription() == null || task.getPlannedDescription().isBlank()) {
            return ResponseEntity.badRequest().body("Planned description is required.");
        }

        if (authenticatedUser != null) {
            task.setResponsible(authenticatedUser);
        }

        if (task.getCreationDate() == null) {
            task.setCreationDate(LocalDate.now());
        }

        Task saved = taskService.save(task);
        return ResponseEntity.ok(saved);
    }

    /**
     * 🔹 Atualiza uma tarefa existente
     */
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
     * 🔹 Pesquisa dinâmica de tarefas com múltiplos filtros opcionais
     *    - Mantém compatibilidade com os parâmetros existentes
     *    - Suporte real a paginação e ordenação no banco
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
                    status, situation, responsibleId, creation, due, id, description, pageable
            );

            if (results.isEmpty()) return ResponseEntity.noContent().build();
            return ResponseEntity.ok(results);

        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest()
                    .body("Invalid date format. Use ISO-8601 format (e.g., 2025-10-21).");
        }
    }

    /**
     * 🔹 Exclui uma tarefa
     */
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
