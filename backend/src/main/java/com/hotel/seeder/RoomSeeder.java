package com.hotel.seeder;

import com.hotel.entity.Room;
import com.hotel.entity.Room.RoomStatus;
import com.hotel.repository.RoomRepository;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(3)
public class RoomSeeder implements Seeder {

    private final RoomRepository roomRepository;

    public RoomSeeder(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @Override
    public void seed() {
        if (roomRepository.count() > 0) return;

        // roomNumber, type, price
        List<Object[]> rooms = List.of(
            new Object[]{"101", "STANDARD",  89.00},
            new Object[]{"102", "STANDARD",  89.00},
            new Object[]{"103", "STANDARD",  95.00},
            new Object[]{"104", "STANDARD",  99.00},
            new Object[]{"201", "DELUXE",   149.00},
            new Object[]{"202", "DELUXE",   149.00},
            new Object[]{"203", "DELUXE",   165.00},
            new Object[]{"204", "DELUXE",   175.00},
            new Object[]{"205", "DELUXE",   185.00},
            new Object[]{"301", "SUITE",    299.00},
            new Object[]{"302", "SUITE",    299.00},
            new Object[]{"303", "SUITE",    349.00},
            new Object[]{"401", "SUITE",    449.00},
            new Object[]{"501", "SUITE",    549.00},
            new Object[]{"PH1", "SUITE",    799.00}
        );

        for (Object[] r : rooms) {
            Room room = new Room();
            room.setRoomNumber((String) r[0]);
            room.setType((String) r[1]);
            room.setPrice((Double) r[2]);
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }

        System.out.println("✅ RoomSeeder: 15 rooms seeded (4 Standard, 5 Deluxe, 6 Suite)");
    }
}
