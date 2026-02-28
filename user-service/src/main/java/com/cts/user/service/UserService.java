package com.cts.user.service;

import com.cts.user.dto.RegisterRequest;
import com.cts.user.dto.UserResponse;
import com.cts.user.exception.DuplicateResourceException;
import com.cts.user.model.User;
import com.cts.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repo;

    @Transactional
    public UserResponse register(RegisterRequest req) {
        if (repo.existsByEmail(req.getEmail().toLowerCase())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (repo.existsByPhone(req.getPhone())) {
            throw new DuplicateResourceException("Phone number already registered");
        }
        if (req.getPhone().length() != 10) {
            throw new IllegalArgumentException("Phone number must be exactly 10 digits");
        }
        User user = User.builder()
                .name(req.getName())
                .role(req.getRole())
                .email(req.getEmail().toLowerCase())
                .phone(req.getPhone())
                .build();
        return toResponse(repo.save(user));
    }

    public UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getName(), u.getRole(), u.getEmail(), u.getPhone());
    }

    public List<UserResponse> listAll() {
        return repo.findAll().stream().map(this::toResponse).toList();
    }
}
