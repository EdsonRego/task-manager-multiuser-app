package com.edsonrego.taskmanager.service;

import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("UserService Unit Tests")
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        sampleUser = new User("Edson", "Rego", "edsonxrego@gmail.com", "123456");
    }

    @Test
    @DisplayName("Deve retornar todos os usuários")
    void testFindAll() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser));

        List<User> users = userService.findAll();

        assertThat(users).isNotEmpty();
        assertThat(users.get(0).getEmail()).isEqualTo("edsonxrego@gmail.com");
        verify(userRepository, times(1)).findAll();
    }

    @Test
    @DisplayName("Deve buscar usuário por e-mail (case-insensitive)")
    void testFindByEmail() {
        when(userRepository.findByEmailIgnoreCase("edsonxrego@gmail.com"))
                .thenReturn(Optional.of(sampleUser));

        Optional<User> result = userService.findByEmail("EdsonXRego@gmail.com");

        assertThat(result).isPresent();
        assertThat(result.get().getFirstName()).isEqualTo("Edson");
        verify(userRepository, times(1)).findByEmailIgnoreCase(anyString());
    }

    @Test
    @DisplayName("Deve salvar usuário novo com senha criptografada e email minúsculo")
    void testSave_NewUser_ShouldEncryptPasswordAndLowercaseEmail() {
        when(passwordEncoder.encode(anyString())).thenReturn("hashed123");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User userToSave = new User("Maria", "Silva", "MARIA.SILVA@EXAMPLE.COM", "123456");
        User saved = userService.save(userToSave);

        assertThat(saved.getPassword()).isEqualTo("hashed123");
        assertThat(saved.getEmail()).isEqualTo("maria.silva@example.com");
        assertThat(saved.getCreatedAt()).isNotNull();

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        verify(passwordEncoder).encode("123456");
        assertThat(captor.getValue().getEmail()).isEqualTo("maria.silva@example.com");
    }

    @Test
    @DisplayName("Deve buscar usuário por ID")
    void testFindById() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));

        Optional<User> result = userService.findById(1L);

        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("edsonxrego@gmail.com");
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("Deve validar senha com BCrypt corretamente")
    void testValidatePassword() {
        when(passwordEncoder.matches("123456", "encodedPass")).thenReturn(true);

        boolean result = userService.validatePassword("123456", "encodedPass");

        assertThat(result).isTrue();
        verify(passwordEncoder).matches("123456", "encodedPass");
    }

    @Test
    @DisplayName("Deve deletar usuário pelo ID")
    void testDeleteUserById() {
        doNothing().when(userRepository).deleteById(1L);

        userService.delete(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    @DisplayName("Deve definir data de criação se ausente")
    void testSave_ShouldSetCreationDateIfNull() {
        when(passwordEncoder.encode(anyString())).thenReturn("hash");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User user = new User("João", "Souza", "joao.souza@example.com", "123456");
        user.setCreatedAt(null);

        User saved = userService.save(user);

        assertThat(saved.getCreatedAt()).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Deve ignorar validação se e-mail for nulo")
    void testFindByEmail_NullEmail_ShouldReturnEmpty() {
        Optional<User> result = userService.findByEmail(null);

        assertThat(result).isEmpty();
        verify(userRepository, never()).findByEmailIgnoreCase(anyString());
    }
}
