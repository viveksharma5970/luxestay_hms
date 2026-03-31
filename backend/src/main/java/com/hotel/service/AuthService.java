package com.hotel.service;

import com.hotel.dto.request.LoginRequest;
import com.hotel.dto.request.RegisterRequest;
import com.hotel.dto.response.AuthResponse;
import com.hotel.entity.User;
import com.hotel.entity.User.Role;
import com.hotel.exception.BadRequestException;
import com.hotel.repository.UserRepository;
import com.hotel.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.GUEST);

        userRepository.save(user);
        return "User registered successfully";
    }

    // Returns the generated JWT token string — controller sets it as a cookie
    public String generateTokenForLogin(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }

    public AuthResponse getAuthInfo(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadRequestException("User not found"));
        return new AuthResponse(user.getEmail(), user.getRole().name());
    }
}
