package com.hotel.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(0) // runs before seeders
public class SchemaUpdater implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public SchemaUpdater(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        addColumnIfMissing("billings", "billing_type", "VARCHAR(10) NOT NULL DEFAULT 'MAIN'");
        removeUniqueConstraintOnBillings();
    }

    // SQLite cannot DROP CONSTRAINT — we recreate the table without the unique constraint
    private void removeUniqueConstraintOnBillings() {
        try {
            // Check if booking_id has a unique index (from old OneToOne mapping)
            var indexes = jdbcTemplate.queryForList("PRAGMA index_list(billings)");
            boolean hasUniqueOnBooking = indexes.stream().anyMatch(idx -> {
                String unique = String.valueOf(idx.get("unique"));
                String name   = String.valueOf(idx.get("name"));
                return "1".equals(unique) && name.toLowerCase().contains("booking");
            });

            if (!hasUniqueOnBooking) return;

            System.out.println("🔧 SchemaUpdater: Removing unique constraint on billings.booking_id...");
            jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS billings_new (" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT," +
                "  booking_id INTEGER NOT NULL," +
                "  room_charges REAL NOT NULL," +
                "  service_charges REAL NOT NULL," +
                "  total_amount REAL NOT NULL," +
                "  payment_status VARCHAR(10) NOT NULL DEFAULT 'PENDING'," +
                "  billing_type VARCHAR(10) NOT NULL DEFAULT 'MAIN'" +
                ")"
            );
            jdbcTemplate.execute(
                "INSERT INTO billings_new (id, booking_id, room_charges, service_charges, total_amount, payment_status, billing_type) " +
                "SELECT id, booking_id, room_charges, service_charges, total_amount, payment_status, " +
                "  COALESCE(billing_type, 'MAIN') FROM billings"
            );
            jdbcTemplate.execute("DROP TABLE billings");
            jdbcTemplate.execute("ALTER TABLE billings_new RENAME TO billings");
            System.out.println("✅ SchemaUpdater: billings table recreated without unique constraint");
        } catch (Exception e) {
            System.err.println("⚠️  SchemaUpdater: billings migration error: " + e.getMessage());
        }
    }

    private void addColumnIfMissing(String table, String column, String definition) {
        try {
            // Check if column exists by querying table info
            var rows = jdbcTemplate.queryForList("PRAGMA table_info(" + table + ")");
            boolean exists = rows.stream()
                .anyMatch(row -> column.equalsIgnoreCase((String) row.get("name")));

            if (!exists) {
                jdbcTemplate.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " " + definition);
                System.out.println("✅ SchemaUpdater: Added column '" + column + "' to table '" + table + "'");
            }
        } catch (Exception e) {
            System.err.println("⚠️  SchemaUpdater: Could not update column '" + column + "': " + e.getMessage());
        }
    }
}
