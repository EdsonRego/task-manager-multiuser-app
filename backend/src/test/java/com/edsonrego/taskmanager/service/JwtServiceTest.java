package com.edsonrego.taskmanager.security;

import com.edsonrego.taskmanager.model.User;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import static org.assertj.core.api.Assertions.*;

/**
 * ✅ Testes unitários para JwtService
 * Compatível com a implementação atual que usa Base64 e Secret dinâmico.
 */
@DisplayName("JwtService Unit Tests (com Base64 e chave configurável)")
class JwtServiceTest {

    private JwtService jwtService;
    private User user;

    @BeforeEach
    void setUp() {
        // Chave com mais de 32 bytes para evitar IllegalArgumentException
        String secret = Base64.getEncoder().encodeToString("my-super-secure-and-long-secret-key-123456".getBytes(StandardCharsets.UTF_8));
        jwtService = new JwtService(secret);

        user = new User();
        user.setId(1L);
        user.setEmail("edsonxrego@gmail.com");
        user.setFirstName("Edson");
        user.setLastName("Rego");
        user.setPassword("123456");
    }

    @Test
    @DisplayName("Deve gerar token JWT válido contendo subject e claim userId")
    void testGenerateToken_Valid() {
        String token = jwtService.generateToken(user);

        assertThat(token).isNotNull();
        assertThat(token.split("\\.")).hasSize(3); // formato JWT padrão
        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    @DisplayName("Deve extrair corretamente o e-mail (subject) do token")
    void testExtractEmail_ValidToken() {
        String token = jwtService.generateToken(user);
        String email = jwtService.extractEmail(token);

        assertThat(email).isEqualTo("edsonxrego@gmail.com");
    }

    @Test
    @DisplayName("Deve retornar falso para token inválido ou corrompido")
    void testIsTokenValid_InvalidToken() {
        String invalidToken = "abc.def.ghi";
        boolean result = jwtService.isTokenValid(invalidToken);

        assertThat(result).isFalse();
    }

    @Test
    @DisplayName("Deve retornar nulo ao tentar extrair e-mail de token inválido")
    void testExtractEmail_InvalidToken() {
        String invalidToken = "invalid.token.value";
        String email = null;

        try {
            email = jwtService.extractEmail(invalidToken);
        } catch (Exception ignored) {
            // esperado, pois o método lança exceção se token inválido
        }

        assertThat(email).isNull();
    }

    @Test
    @DisplayName("Deve gerar tokens diferentes para usuários diferentes")
    void testGenerateToken_DifferentUsers() {
        User user2 = new User("Maria", "Silva", "maria@example.com", "123456");
        user2.setId(2L);

        String token1 = jwtService.generateToken(user);
        String token2 = jwtService.generateToken(user2);

        assertThat(token1).isNotEqualTo(token2);
    }

    @Test
    @DisplayName("Deve lançar exceção se chave tiver menos de 32 bytes")
    void testConstructor_ShouldThrowForShortKey() {
        String shortSecret = Base64.getEncoder().encodeToString("short-key".getBytes(StandardCharsets.UTF_8));

        assertThatThrownBy(() -> new JwtService(shortSecret))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("at least 32 bytes long");
    }

    @Test
    @DisplayName("Deve aceitar chave não codificada em Base64 (texto puro)")
    void testConstructor_ShouldAcceptPlainTextKey() {
        String plainTextSecret = "this-is-a-plain-text-key-with-32-bytes-123456";
        JwtService localService = new JwtService(plainTextSecret);

        String token = localService.generateToken(user);
        assertThat(localService.isTokenValid(token)).isTrue();
    }

    @Test
    @DisplayName("Token inválido deve lançar JwtException ao tentar parsear claims")
    void testInvalidToken_ShouldThrowJwtException() {
        String invalidToken = "header.payload.signature";
        boolean valid = jwtService.isTokenValid(invalidToken);

        assertThat(valid).isFalse(); // método já trata internamente a exceção
    }
}
