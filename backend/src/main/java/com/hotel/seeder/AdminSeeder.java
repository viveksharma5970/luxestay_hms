package com.hotel.seeder;

import com.hotel.entity.User;
import com.hotel.entity.User.Role;
import com.hotel.repository.UserRepository;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class AdminSeeder implements Seeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void seed() {
        if (userRepository.existsByEmail("admin@luxestay.com")) return;

        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@luxestay.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);

        System.out.println("✅ AdminSeeder: Admin user seeded → admin@luxestay.com / admin123");
    }
}
