package com.edsonrego.taskmanager.repository;

import com.edsonrego.taskmanager.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Deve salvar e buscar usuário por e-mail")
    void shouldSaveAndFindUserByEmail() {
        // Arrange
        User user = new User();
        user.setFirstName("Edson");
        user.setLastName("Rego");
        user.setEmail("edson@test.com");
        user.setPassword("123456");

        userRepository.save(user);

        // Act
        Optional<User> found = userRepository.findByEmailIgnoreCase("edson@test.com");

        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getEmail()).isEqualTo("edson@test.com");
    }
}
