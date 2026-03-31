package com.hotel.service;

import com.hotel.dto.response.DashboardResponse;
import com.hotel.entity.Booking.BookingStatus;
import com.hotel.repository.BillingRepository;
import com.hotel.repository.BookingRepository;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    private final BookingRepository bookingRepository;
    private final BillingRepository billingRepository;

    public AdminService(BookingRepository bookingRepository, BillingRepository billingRepository) {
        this.bookingRepository = bookingRepository;
        this.billingRepository = billingRepository;
    }

    public DashboardResponse getDashboard() {
        long totalBookings = bookingRepository.count();
        double totalRevenue = billingRepository.getTotalRevenue();
        long activeGuests = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        return new DashboardResponse(totalBookings, totalRevenue, activeGuests);
    }
}
