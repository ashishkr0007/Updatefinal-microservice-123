package com.cts.user.controller;

import com.cts.user.dto.*;
import com.cts.user.exception.ResourceNotFoundException;
import com.cts.user.model.User;
import com.cts.user.repository.UserRepository;
import com.cts.user.security.JwtService;
import com.cts.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest req) {
        var created = userService.register(req);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email"));

        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of("role", user.getRole().name(), "uid", user.getId())
        );

        return ResponseEntity.ok(new AuthResponse("Bearer", token, jwtService.getExpirationSeconds()));
    }
}
