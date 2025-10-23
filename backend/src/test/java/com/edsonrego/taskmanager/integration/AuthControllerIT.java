package com.edsonrego.taskmanager.integration;

import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.security.JwtService;
import com.edsonrego.taskmanager.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class AuthControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    private User mockUser;

    @BeforeEach
    void setup() {
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setFirstName("Edson");
        mockUser.setLastName("Rego");
        mockUser.setEmail("edson@test.com");
        mockUser.setPassword("encodedPassword");

        // Configura comportamento padrão dos mocks
        when(userService.findByEmail("edson@test.com")).thenReturn(Optional.of(mockUser));
        when(userService.validatePassword("123456", "encodedPassword")).thenReturn(true);
        when(jwtService.generateToken(mockUser)).thenReturn("mocked-jwt-token");
    }

    @Test
    @DisplayName("POST /api/auth/login → deve retornar token JWT quando credenciais são válidas")
    void testLoginSuccess() throws Exception {
        String body = """
                {
                    "email": "edson@test.com",
                    "password": "123456"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value("mocked-jwt-token"))
                .andExpect(jsonPath("$.email").value("edson@test.com"))
                .andExpect(jsonPath("$.user").value("Edson Rego"));
    }

    @Test
    @DisplayName("POST /api/auth/login → deve retornar 404 quando usuário não existe")
    void testLoginUserNotFound() throws Exception {
        when(userService.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        String body = """
                {
                    "email": "unknown@test.com",
                    "password": "123456"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("User not found"));
    }

    @Test
    @DisplayName("POST /api/auth/login → deve retornar 401 quando senha está incorreta")
    void testLoginInvalidPassword() throws Exception {
        when(userService.validatePassword(eq("wrongpassword"), any())).thenReturn(false);

        String body = """
                {
                    "email": "edson@test.com",
                    "password": "wrongpassword"
                }
                """;

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }
}
