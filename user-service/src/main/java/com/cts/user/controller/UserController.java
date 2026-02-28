package com.cts.user.controller;

import com.cts.user.dto.UserResponse;
import com.cts.user.exception.ErrorResponse;
import com.cts.user.exception.ResourceNotFoundException;
import com.cts.user.repository.UserRepository;
import com.cts.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(@RequestHeader("X-User-Email") String email) {
        var user = userRepository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(userService.toResponse(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return ResponseEntity.ok(userService.toResponse(user));
    }

    @GetMapping("/internal/{id}")
    public ResponseEntity<UserResponse> getUserByIdInternal(@PathVariable Long id) {
        var user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return ResponseEntity.ok(userService.toResponse(user));
    }

    @GetMapping
    public ResponseEntity<?> listAll(
            @RequestHeader(value = "X-User-Role", required = false) String role) {
        if (role == null || !"ADMIN".equals(role)) {
            return ResponseEntity.status(403)
                    .body(new ErrorResponse("You are not authorized to access this resource"));
        }
        return ResponseEntity.ok(userService.listAll());
    }
}
