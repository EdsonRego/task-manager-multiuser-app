package com.edsonrego.taskmanager.controller;

import com.edsonrego.taskmanager.dto.UserDTO;
import com.edsonrego.taskmanager.model.User;
import com.edsonrego.taskmanager.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 🔹 Retorna todos os usuários
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // 🔹 Cria novo usuário (com retorno padronizado em DTO)
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }

        User saved = userService.save(user);
        UserDTO dto = new UserDTO(
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getEmail(),
                saved.getCreatedAt()
        );

        return ResponseEntity.ok(dto);
    }

    // 🔹 Atualiza usuário existente (parcial)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.findById(id)
                .map(existing -> {
                    // 💡 Evita e-mail duplicado (se foi enviado e mudou)
                    if (updatedUser.getEmail() != null && !updatedUser.getEmail().equalsIgnoreCase(existing.getEmail())) {
                        var byEmail = userService.findByEmail(updatedUser.getEmail());
                        if (byEmail.isPresent() && !byEmail.get().getId().equals(id)) {
                            return ResponseEntity.badRequest().body("Email already registered.");
                        }
                        existing.setEmail(updatedUser.getEmail());
                    }

                    if (updatedUser.getFirstName() != null) {
                        existing.setFirstName(updatedUser.getFirstName());
                    }
                    if (updatedUser.getLastName() != null) {
                        existing.setLastName(updatedUser.getLastName());
                    }
                    // ⚠️ Se vier senha nova, deixe o UserService.save() criptografar
                    if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
                        existing.setPassword(updatedUser.getPassword()); // raw aqui; será encodada no save()
                    }

                    var saved = userService.save(existing);
                    var dto = new UserDTO(
                            saved.getId(),
                            saved.getFirstName(),
                            saved.getLastName(),
                            saved.getEmail(),
                            saved.getCreatedAt()
                    );
                    return ResponseEntity.ok(dto);
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

    // 🔹 Busca usuário por e-mail
    @GetMapping("/find")
    public ResponseEntity<?> findByEmail(@RequestParam String email) {
        return userService.findByEmail(email)
                .map(u -> new UserDTO(
                        u.getId(),
                        u.getFirstName(),
                        u.getLastName(),
                        u.getEmail(),
                        u.getCreatedAt()
                ))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Exclui usuário pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
            return userService.findById(id)
                .map(user -> {
                    userService.delete(id);
                    return ResponseEntity.ok("User deleted successfully.");
                })
                .orElse(ResponseEntity.status(404).body("User not found."));
    }
}
