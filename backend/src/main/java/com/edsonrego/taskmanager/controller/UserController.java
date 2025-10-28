package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.UserService;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 🔹 Lista todos os usuários com suporte a paginação e ordenação
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "false") boolean paged
    ) {
        List<User> allUsers = userService.findAll();
        if (allUsers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // 🔹 Caso o cliente não queira paginação (mantém compatibilidade)
        if (!paged) {
            return ResponseEntity.ok(allUsers);
        }

        // 🔹 Caso contrário, aplica paginação e ordenação
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        int start = Math.min((int) pageable.getOffset(), allUsers.size());
        int end = Math.min((start + pageable.getPageSize()), allUsers.size());
        Page<User> userPage = new PageImpl<>(allUsers.subList(start, end), pageable, allUsers.size());

        return ResponseEntity.ok(userPage);
    }

    // 🔹 Busca usuário por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> userOpt = userService.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
        return ResponseEntity.ok(userOpt.get());
    }

    // 🔹 Busca usuário por e-mail
    @GetMapping("/by-email")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        Optional<User> userOpt = userService.findByEmail(email);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        }
        return ResponseEntity.ok(userOpt.get());
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        boolean exists = userService.findByEmail(email).isPresent();
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    // 🔹 Cria novo usuário
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required.");
        }

        Optional<User> existingUser = userService.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("User with this email already exists.");
        }

        User saved = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 🔹 Atualiza dados de um usuário existente (parcial)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingOpt = userService.findById(id);
        if (existingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User existing = existingOpt.get();

        if (updatedUser.getFirstName() != null)
            existing.setFirstName(updatedUser.getFirstName());

        if (updatedUser.getLastName() != null)
            existing.setLastName(updatedUser.getLastName());

        if (updatedUser.getEmail() != null)
            existing.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank())
            existing.setPassword(updatedUser.getPassword());

        User saved = userService.save(existing);
        return ResponseEntity.ok(saved);
    }

    // 🔹 Exclui um usuário
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> userOpt = userService.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        userService.delete(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
}
