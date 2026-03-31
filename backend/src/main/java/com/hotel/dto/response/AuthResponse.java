package com.hotel.dto.response;

public class AuthResponse {

    private String email;
    private String role;

    public AuthResponse(String email, String role) {
        this.email = email;
        this.role = role;
    }

    public String getEmail() { return email; }
    public String getRole() { return role; }
}
