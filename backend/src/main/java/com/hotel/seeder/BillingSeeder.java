package com.hotel.seeder;

import com.hotel.entity.Billing;
import com.hotel.entity.Billing.PaymentStatus;
import com.hotel.entity.Booking;
import com.hotel.entity.Booking.BookingStatus;
import com.hotel.repository.BillingRepository;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.ServiceRequestRepository;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Component
@Order(7)
public class BillingSeeder implements Seeder {

    private final BillingRepository billingRepository;
    private final BookingRepository bookingRepository;
    private final ServiceRequestRepository serviceRequestRepository;

    public BillingSeeder(BillingRepository billingRepository,
                          BookingRepository bookingRepository,
                          ServiceRequestRepository serviceRequestRepository) {
        this.billingRepository = billingRepository;
        this.bookingRepository = bookingRepository;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    @Override
    @Transactional
    public void seed() {
        if (billingRepository.count() > 0) return;

        List<Booking> bookings = bookingRepository.findAll();
        int count = 0;

        for (Booking booking : bookings) {
            if (booking.getStatus() == BookingStatus.CANCELLED) continue;

            long nights = java.time.temporal.ChronoUnit.DAYS.between(
                booking.getCheckInDate(), booking.getCheckOutDate()
            );
            double roomCharges = booking.getRoom().getPrice() * Math.max(nights, 1);
            double serviceCharges = serviceRequestRepository.sumServiceChargesByBookingId(booking.getId());
            double total = roomCharges + serviceCharges;

            Billing billing = new Billing();
            billing.setBooking(booking);
            billing.setRoomCharges(roomCharges);
            billing.setServiceCharges(serviceCharges);
            billing.setTotalAmount(total);
            billing.setPaymentStatus(
                booking.getStatus() == BookingStatus.COMPLETED
                    ? PaymentStatus.PAID
                    : PaymentStatus.PENDING
            );

            billingRepository.save(billing);
            count++;
        }

        System.out.println("✅ BillingSeeder: " + count + " billing records seeded");
    }
}
