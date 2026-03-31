package com.hotel.seeder;

import com.hotel.entity.Booking;
import com.hotel.entity.Booking.BookingStatus;
import com.hotel.entity.Room;
import com.hotel.entity.Room.RoomStatus;
import com.hotel.entity.User;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.RoomRepository;
import com.hotel.repository.UserRepository;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@Order(5)
public class BookingSeeder implements Seeder {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public BookingSeeder(BookingRepository bookingRepository,
                         UserRepository userRepository,
                         RoomRepository roomRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    @Override
    public void seed() {
        if (bookingRepository.count() > 0) return;

        // email, roomNumber, checkIn, checkOut, status
        List<Object[]> bookings = List.of(
            new Object[]{"alice@example.com", "101", LocalDate.now().minusDays(10), LocalDate.now().minusDays(7),  BookingStatus.COMPLETED},
            new Object[]{"alice@example.com", "201", LocalDate.now().plusDays(5),  LocalDate.now().plusDays(9),   BookingStatus.CONFIRMED},
            new Object[]{"bob@example.com",   "102", LocalDate.now().minusDays(5), LocalDate.now().minusDays(2),  BookingStatus.COMPLETED},
            new Object[]{"bob@example.com",   "301", LocalDate.now().plusDays(2),  LocalDate.now().plusDays(6),   BookingStatus.CONFIRMED},
            new Object[]{"clara@example.com", "202", LocalDate.now().minusDays(3), LocalDate.now().plusDays(1),   BookingStatus.CONFIRMED},
            new Object[]{"clara@example.com", "103", LocalDate.now().minusDays(15),LocalDate.now().minusDays(12), BookingStatus.CANCELLED},
            new Object[]{"david@example.com", "203", LocalDate.now().plusDays(10), LocalDate.now().plusDays(14),  BookingStatus.CONFIRMED},
            new Object[]{"emma@example.com",  "302", LocalDate.now().minusDays(8), LocalDate.now().minusDays(4),  BookingStatus.COMPLETED}
        );

        int count = 0;
        for (Object[] b : bookings) {
            Optional<User> userOpt = userRepository.findByEmail((String) b[0]);
            Optional<Room> roomOpt = roomRepository.findAll().stream()
                .filter(r -> r.getRoomNumber().equals(b[1])).findFirst();

            if (userOpt.isEmpty() || roomOpt.isEmpty()) continue;

            Booking booking = new Booking();
            booking.setUser(userOpt.get());
            booking.setRoom(roomOpt.get());
            booking.setCheckInDate((LocalDate) b[2]);
            booking.setCheckOutDate((LocalDate) b[3]);
            booking.setStatus((BookingStatus) b[4]);
            bookingRepository.save(booking);

            // Mark room BOOKED if booking is active/confirmed
            if (b[4] == BookingStatus.CONFIRMED) {
                Room room = roomOpt.get();
                room.setStatus(RoomStatus.BOOKED);
                roomRepository.save(room);
            }
            count++;
        }

        System.out.println("✅ BookingSeeder: " + count + " bookings seeded");
    }
}
