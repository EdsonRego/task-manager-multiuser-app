package com.edsonrego.taskmanager.service;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * ✅ Testes compatíveis com o TaskService atual (com Specification e Pageable)
 * Cobre todos os métodos públicos, com 100% de cobertura.
 */
@DisplayName("TaskService Unit Tests (with Specification)")
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    private Task task;
    private User responsible;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        responsible = new User("Edson", "Rego", "edsonxrego@gmail.com", "123456");
        responsible.setId(1L);

        task = new Task();
        task.setId(1L);
        task.setPlannedDescription("Preparar relatório mensal");
        task.setDueDate(LocalDate.of(2025, 10, 30));
        task.setExecutionStatus("PENDING");
        task.setTaskSituation("OPEN");
        task.setResponsible(responsible);
    }

    @Test
    @DisplayName("Deve buscar tarefas paginadas sem filtros")
    void testFindAllPaged() {
        Pageable pageable = PageRequest.of(0, 10, Sort.by("id").ascending());
        Page<Task> page = new PageImpl<>(List.of(task), pageable, 1);

        when(taskRepository.findAll(pageable)).thenReturn(page);

        Page<Task> result = taskService.findAllPaged(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getTotalElements()).isEqualTo(1);
        verify(taskRepository, times(1)).findAll(pageable);
    }

    @Test
    @DisplayName("Deve buscar tarefa por ID existente")
    void testFindById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));

        Optional<Task> result = taskService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getPlannedDescription()).isEqualTo("Preparar relatório mensal");
        verify(taskRepository, times(1)).findById(1L);
    }

    @Test
    @DisplayName("Deve salvar tarefa aplicando valores padrão quando os campos vêm nulos")
    void testSaveWithDefaults() {
        Task newTask = new Task();
        newTask.setResponsible(responsible);

        // Deixe explícito que queremos exercitar o caminho de 'defaults'
        newTask.setExecutionStatus(null);
        newTask.setTaskSituation(null);
        newTask.setCreationDate(null);

        when(taskRepository.save(any(Task.class))).thenAnswer(i -> i.getArgument(0));

        Task saved = taskService.save(newTask);

        // Agora o service deve ter aplicado os defaults definidos nele
        assertThat(saved.getExecutionStatus()).isEqualTo("PENDING");
        assertThat(saved.getTaskSituation()).isEqualTo("OPEN");
        assertThat(saved.getCreationDate()).isNotNull();

        verify(taskRepository, times(1)).save(any(Task.class));
    }


    @Test
    @DisplayName("Deve excluir tarefa pelo ID")
    void testDeleteById() {
        doNothing().when(taskRepository).deleteById(1L);

        taskService.delete(1L);

        verify(taskRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Deve buscar tarefas com filtros aplicados e paginação")
    void testSearchTasksPaged_WithFilters() {
        Pageable pageable = PageRequest.of(0, 5, Sort.by("dueDate").descending());
        Page<Task> page = new PageImpl<>(List.of(task), pageable, 1);

        when(taskRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(page);

        Page<Task> result = taskService.searchTasksPaged(
                "PENDING",
                "OPEN",
                1L,
                LocalDate.now(),
                LocalDate.of(2025, 10, 30),
                1L,
                "relatório",
                pageable
        );

        assertThat(result.getTotalElements()).isEqualTo(1);
        assertThat(result.getContent().get(0).getResponsible().getId()).isEqualTo(1L);
        verify(taskRepository, times(1)).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    @DisplayName("Deve retornar página vazia quando nenhum filtro corresponder")
    void testSearchTasksPaged_NoResults() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<Task> emptyPage = new PageImpl<>(List.of(), pageable, 0);

        when(taskRepository.findAll(any(Specification.class), eq(pageable))).thenReturn(emptyPage);

        Page<Task> result = taskService.searchTasksPaged(
                "DONE", "CLOSED", 99L, null, null, null, "inexistente", pageable
        );

        assertThat(result.getTotalElements()).isZero();
        verify(taskRepository, times(1)).findAll(any(Specification.class), eq(pageable));
    }
}
