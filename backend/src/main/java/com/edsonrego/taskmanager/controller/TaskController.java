package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.dto.TaskDTO;
import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.TaskService;
import com.edsonrego.taskmanager.service.UserService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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

    // Retorna todas as tarefas
    @GetMapping
    public List<TaskDTO> getAllTasks() {
        return taskService.findAll().stream().map(task -> new TaskDTO(
                task.getId(),
                task.getPlannedDescription(),
                task.getExecutedDescription(),
                task.getCreationDate(),
                task.getDueDate(),
                task.getExecutionStatus(),
                task.getTaskSituation(),
                task.getResponsible().getId(),
                task.getResponsible().getFirstName() + " " + task.getResponsible().getLastName()
        )).collect(Collectors.toList());
    }

    // Cria uma nova tarefa
    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody Task task) {
        User responsible = userService.findByEmail(task.getResponsible().getEmail())
                .orElse(null);
        if (responsible == null) {
            return ResponseEntity.badRequest().body("Responsible user not found.");
        }
        task.setResponsible(responsible);
        return ResponseEntity.ok(taskService.save(task));
    }

    // 🔍 Busca tarefas com filtros opcionais
    @GetMapping("/search")
    public ResponseEntity<List<TaskDTO>> searchTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String situation,
            @RequestParam(required = false) Long responsibleId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate createDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam(required = false) Long id
    ) {
        List<Task> results = taskService.searchTasks(status, situation, responsibleId, createDate, dueDate, id);
        List<TaskDTO> dtoList = results.stream().map(task -> new TaskDTO(
                task.getId(),
                task.getPlannedDescription(),
                task.getExecutedDescription(),
                task.getCreationDate(),
                task.getDueDate(),
                task.getExecutionStatus(),
                task.getTaskSituation(),
                task.getResponsible().getId(),
                task.getResponsible().getFirstName() + " " + task.getResponsible().getLastName()
        )).collect(Collectors.toList());
        return ResponseEntity.ok(dtoList);
    }
}
