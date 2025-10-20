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

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.findAll().stream()
                .map(u -> new UserDTO(u.getId(), u.getFirstName(), u.getLastName(), u.getEmail(), u.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered.");
        }
        return ResponseEntity.ok(userService.save(user));
    }
}
