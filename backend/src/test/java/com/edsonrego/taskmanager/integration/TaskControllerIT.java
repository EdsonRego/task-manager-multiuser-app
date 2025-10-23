package com.edsonrego.taskmanager.integration;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.repository.TaskRepository;
import com.edsonrego.taskmanager.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class TaskControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    void setUp() {
        taskRepository.deleteAll();
        userRepository.deleteAll();

        user = new User("Edson", "Rego", "edson@test.com", "123456");
        userRepository.save(user);
    }

    @Test
    @DisplayName("Deve criar uma nova tarefa com sucesso")
    void testCreateTask() throws Exception {
        Task task = new Task();
        task.setPlannedDescription("Preparar relatório de outubro");
        task.setExecutionStatus("PENDING");
        task.setTaskSituation("OPEN");
        task.setDueDate(LocalDate.of(2025, 10, 31));
        task.setResponsible(user);

        mockMvc.perform(post("/api/tasks")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk()) // ✅ aplicação retorna 200
                .andExpect(jsonPath("$.plannedDescription").value("Preparar relatório de outubro"))
                .andExpect(jsonPath("$.executionStatus").value("PENDING"))
                .andExpect(jsonPath("$.responsible.email").value("edson@test.com"));
    }

    @Test
    @DisplayName("Deve listar todas as tarefas")
    void testGetAllTasks() throws Exception {
        Task task = new Task();
        task.setPlannedDescription("Estudo de integração");
        task.setExecutionStatus("PENDING");
        task.setTaskSituation("OPEN");
        task.setDueDate(LocalDate.now().plusDays(3));
        task.setResponsible(user);
        taskRepository.save(task);

        mockMvc.perform(get("/api/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].plannedDescription").value("Estudo de integração"));
    }

    @Test
    @DisplayName("Deve buscar tarefa por ID existente")
    void testGetTaskById() throws Exception {
        Task task = new Task();
        task.setPlannedDescription("Relatório financeiro");
        task.setDueDate(LocalDate.now().plusDays(5));
        task.setResponsible(user);
        task = taskRepository.save(task);

        mockMvc.perform(get("/api/tasks/{id}", task.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.plannedDescription").value("Relatório financeiro"));
    }

    @Test
    @DisplayName("Deve retornar 404 ao buscar tarefa inexistente")
    void testGetTaskById_NotFound() throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", 999))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve atualizar uma tarefa existente")
    void testUpdateTask() throws Exception {
        Task task = new Task();
        task.setPlannedDescription("Backup diário");
        task.setDueDate(LocalDate.now().plusDays(2));
        task.setResponsible(user);
        task = taskRepository.save(task);

        task.setExecutedDescription("Backup concluído com sucesso");
        task.setExecutionStatus("DONE");
        task.setTaskSituation("CLOSED");

        mockMvc.perform(put("/api/tasks/{id}", task.getId())
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(task)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.executionStatus").value("DONE"))
                .andExpect(jsonPath("$.taskSituation").value("CLOSED"));
    }

    @Test
    @DisplayName("Deve excluir uma tarefa por ID")
    void testDeleteTask() throws Exception {
        Task task = new Task();
        task.setPlannedDescription("Tarefa temporária");
        task.setDueDate(LocalDate.now().plusDays(1));
        task.setResponsible(user);
        task = taskRepository.save(task);

        mockMvc.perform(delete("/api/tasks/{id}", task.getId()))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve buscar tarefas com filtro de status e responsável")
    void testSearchTasksWithFilters() throws Exception {
        Task task = new Task();
        task.setPlannedDescription("Verificar servidor");
        task.setExecutionStatus("PENDING");
        task.setTaskSituation("OPEN");
        task.setDueDate(LocalDate.now().plusDays(4));
        task.setResponsible(user);
        taskRepository.save(task);

        mockMvc.perform(get("/api/tasks/search")
                        .param("status", "PENDING")
                        .param("responsibleId", String.valueOf(user.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].plannedDescription").value("Verificar servidor"));

    }
}
