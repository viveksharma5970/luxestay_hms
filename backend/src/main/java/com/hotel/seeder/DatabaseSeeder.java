package com.hotel.seeder;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Value("${app.seeder.enabled:false}")
    private boolean seederEnabled;

    private final List<Seeder> seeders;

    public DatabaseSeeder(List<Seeder> seeders) {
        this.seeders = seeders;
    }

    @Override
    public void run(String... args) {
        if (!seederEnabled) {
            System.out.println("⏭️  DatabaseSeeder: Seeding is disabled (app.seeder.enabled=false)");
            return;
        }
        System.out.println("🌱 Running database seeders...");
        seeders.forEach(Seeder::seed);
        System.out.println("✅ All seeders completed.");
    }
}
