package com.edsonrego.taskmanager.integration;

import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * ✅ Testes de integração do UserController
 * - Usa banco H2 em memória
 * - Desativa segurança para testes
 * - Garante isolamento transacional
 */
@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@Transactional
@DisplayName("UserController Integration Tests")
class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User("Edson", "Rego", "edsonxrego@gmail.com", passwordEncoder.encode("123456"));
        userRepository.save(user);
    }

    @Test
    @DisplayName("Deve retornar todos os usuários com status 200")
    void testGetAllUsers() throws Exception {
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    @DisplayName("Deve buscar usuário por ID existente")
    void testGetUserById() throws Exception {
        mockMvc.perform(get("/api/users/{id}", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("edsonxrego@gmail.com"));
    }

    @Test
    @DisplayName("Deve retornar 404 para usuário inexistente")
    void testGetUserById_NotFound() throws Exception {
        mockMvc.perform(get("/api/users/{id}", 9999L))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Deve criar novo usuário com sucesso")
    void testCreateUser() throws Exception {
        String json = objectMapper.writeValueAsString(Map.of(
                "firstName", "Maria",
                "lastName", "Silva",
                "email", "maria.silva@example.com",
                "password", "123456"
        ));

        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("maria.silva@example.com"));

        assertThat(userRepository.findByEmailIgnoreCase("maria.silva@example.com")).isPresent();
    }

    @Test
    @DisplayName("Deve atualizar dados do usuário existente")
    void testUpdateUser() throws Exception {
        String json = objectMapper.writeValueAsString(Map.of(
                "firstName", "Edson Luiz",
                "lastName", "Rego Atualizado"
        ));

        mockMvc.perform(put("/api/users/{id}", user.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Edson Luiz"));
    }

    @Test
    @DisplayName("Deve deletar usuário com sucesso")
    void testDeleteUser() throws Exception {
        mockMvc.perform(delete("/api/users/{id}", user.getId()))
                .andExpect(status().isOk());

        assertThat(userRepository.findById(user.getId())).isEmpty();
    }

    @Test
    @DisplayName("Deve buscar usuário por e-mail")
    void testGetUserByEmail() throws Exception {
        mockMvc.perform(get("/api/users/by-email")
                        .param("email", "edsonxrego@gmail.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Edson"));
    }
}
