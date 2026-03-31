package com.hotel.seeder;

import com.hotel.entity.User;
import com.hotel.entity.User.Role;
import com.hotel.repository.UserRepository;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
public class UserSeeder implements Seeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void seed() {
        List<String[]> guests = List.of(
            new String[]{"Alice Johnson",   "alice@example.com",   "guest123"},
            new String[]{"Bob Martinez",    "bob@example.com",     "guest123"},
            new String[]{"Clara Smith",     "clara@example.com",   "guest123"},
            new String[]{"David Lee",       "david@example.com",   "guest123"},
            new String[]{"Emma Wilson",     "emma@example.com",    "guest123"}
        );

        int count = 0;
        for (String[] g : guests) {
            if (userRepository.existsByEmail(g[1])) continue;
            User user = new User();
            user.setName(g[0]);
            user.setEmail(g[1]);
            user.setPassword(passwordEncoder.encode(g[2]));
            user.setRole(Role.GUEST);
            userRepository.save(user);
            count++;
        }

        if (count > 0)
            System.out.println("✅ UserSeeder: " + count + " guest users seeded (password: guest123)");
    }
}
