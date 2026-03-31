package com.hotel.service;

import com.hotel.dto.request.BookingRequest;
import com.hotel.dto.response.BookingResponse;
import com.hotel.entity.Booking;
import com.hotel.entity.Booking.BookingStatus;
import com.hotel.entity.Room;
import com.hotel.entity.Room.RoomStatus;
import com.hotel.entity.User;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomService roomService;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, RoomService roomService,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.roomService = roomService;
        this.userRepository = userRepository;
    }

    public BookingResponse createBooking(String email, BookingRequest request) {
        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new BadRequestException("Check-out date must be after check-in date");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Room room = roomService.findById(request.getRoomId());

        if (bookingRepository.existsOverlappingBooking(room.getId(),
                request.getCheckInDate(), request.getCheckOutDate())) {
            throw new BadRequestException("Room is already booked for the selected dates");
        }

        room.setStatus(RoomStatus.BOOKED);

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setRoom(room);
        booking.setCheckInDate(request.getCheckInDate());
        booking.setCheckOutDate(request.getCheckOutDate());
        booking.setStatus(BookingStatus.CONFIRMED);

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getMyBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public BookingResponse cancelBooking(Long id, String email) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!booking.getUser().getEmail().equals(email)) {
            throw new BadRequestException("You are not authorized to cancel this booking");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.getRoom().setStatus(RoomStatus.AVAILABLE);
        return toResponse(bookingRepository.save(booking));
    }

    public Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private BookingResponse toResponse(Booking b) {
        return new BookingResponse(b.getId(), b.getUser().getId(), b.getUser().getName(),
                b.getRoom().getId(), b.getRoom().getRoomNumber(),
                b.getCheckInDate(), b.getCheckOutDate(), b.getStatus().name());
    }
}
