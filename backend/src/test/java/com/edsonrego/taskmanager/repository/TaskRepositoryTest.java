package com.edsonrego.taskmanager.repository;

import com.edsonrego.taskmanager.model.Task;
import com.edsonrego.taskmanager.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class TaskRepositoryTest {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Deve salvar uma tarefa vinculada a um usuário")
    void shouldSaveTaskWithUser() {
        // Arrange
        User user = new User("Edson", "Rego", "edson@test.com", "123456");
        userRepository.save(user);

        Task task = new Task();
        task.setPlannedDescription("Testar persistência de tarefa");
        task.setExecutionStatus("PENDING");
        task.setTaskSituation("OPEN");
        task.setCreationDate(LocalDate.now());
        task.setDueDate(LocalDate.now().plusDays(3));
        task.setResponsible(user);

        // Act
        Task savedTask = taskRepository.save(task);

        // Assert
        assertThat(savedTask.getId()).isNotNull();
        assertThat(savedTask.getResponsible().getEmail()).isEqualTo("edson@test.com");
    }

    @Test
    @DisplayName("Deve retornar tarefas ordenadas por data de vencimento")
    void shouldReturnTasksOrderedByDueDate() {
        // Arrange
        User user = new User("Edson", "Rego", "edson2@test.com", "123456");
        userRepository.save(user);

        Task task1 = new Task();
        task1.setPlannedDescription("Tarefa mais antiga");
        task1.setExecutionStatus("PENDING");
        task1.setTaskSituation("OPEN");
        task1.setCreationDate(LocalDate.now());
        task1.setDueDate(LocalDate.now().plusDays(1));
        task1.setResponsible(user);

        Task task2 = new Task();
        task2.setPlannedDescription("Tarefa mais recente");
        task2.setExecutionStatus("PENDING");
        task2.setTaskSituation("OPEN");
        task2.setCreationDate(LocalDate.now());
        task2.setDueDate(LocalDate.now().plusDays(5));
        task2.setResponsible(user);

        taskRepository.saveAll(List.of(task2, task1));

        // Act
        List<Task> tasks = taskRepository.findAll(Sort.by(Sort.Direction.ASC, "dueDate"));

        // Assert
        assertThat(tasks).hasSize(2);
        assertThat(tasks.get(0).getPlannedDescription()).isEqualTo("Tarefa mais antiga");
        assertThat(tasks.get(1).getPlannedDescription()).isEqualTo("Tarefa mais recente");
    }

    @Test
    @DisplayName("Deve retornar tarefas paginadas corretamente")
    void shouldReturnPaginatedTasks() {
        // Arrange
        User user = new User("Edson", "Rego", "edson3@test.com", "123456");
        userRepository.save(user);

        for (int i = 1; i <= 7; i++) {
            Task task = new Task();
            task.setPlannedDescription("Tarefa " + i);
            task.setExecutionStatus("PENDING");
            task.setTaskSituation("OPEN");
            task.setCreationDate(LocalDate.now());
            task.setDueDate(LocalDate.now().plusDays(i));
            task.setResponsible(user);
            taskRepository.save(task);
        }

        Pageable pageable = PageRequest.of(0, 5, Sort.by("dueDate").ascending());

        // Act
        Page<Task> page = taskRepository.findAll(pageable);

        // Assert
        assertThat(page.getContent()).hasSize(5);
        assertThat(page.getTotalElements()).isEqualTo(7);
        assertThat(page.getTotalPages()).isEqualTo(2);
    }
}
