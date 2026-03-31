package com.hotel.service;

import com.hotel.dto.response.BillingResponse;
import com.hotel.entity.Billing;
import com.hotel.entity.Billing.PaymentStatus;
import com.hotel.entity.Booking;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.BillingRepository;
import com.hotel.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;

@Service
public class BillingService {

    private final BillingRepository billingRepository;
    private final BookingService bookingService;
    private final ServiceRequestRepository serviceRequestRepository;

    public BillingService(BillingRepository billingRepository, BookingService bookingService,
                          ServiceRequestRepository serviceRequestRepository) {
        this.billingRepository = billingRepository;
        this.bookingService = bookingService;
        this.serviceRequestRepository = serviceRequestRepository;
    }

    public BillingResponse generateBill(Long bookingId) {
        if (billingRepository.findByBookingId(bookingId).isPresent()) {
            throw new BadRequestException("Bill already generated for booking: " + bookingId);
        }

        Booking booking = bookingService.findById(bookingId);
        long nights = ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate());
        double roomCharges = nights * booking.getRoom().getPrice();
        double serviceCharges = serviceRequestRepository.sumServiceChargesByBookingId(bookingId);
        double total = roomCharges + serviceCharges;

        Billing billing = new Billing();
        billing.setBooking(booking);
        billing.setRoomCharges(roomCharges);
        billing.setServiceCharges(serviceCharges);
        billing.setTotalAmount(total);
        billing.setPaymentStatus(PaymentStatus.PENDING);

        return toResponse(billingRepository.save(billing));
    }

    public BillingResponse getBillByBookingId(Long bookingId) {
        Billing billing = billingRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found for booking: " + bookingId));

        // Recalculate service charges dynamically so new services are reflected
        double liveServiceCharges = serviceRequestRepository.sumServiceChargesByBookingId(bookingId);
        if (liveServiceCharges != billing.getServiceCharges()) {
            billing.setServiceCharges(liveServiceCharges);
            billing.setTotalAmount(billing.getRoomCharges() + liveServiceCharges);
            billingRepository.save(billing);
        }

        return toResponse(billing);
    }

    public BillingResponse markAsPaid(Long billingId) {
        Billing billing = billingRepository.findById(billingId)
                .orElseThrow(() -> new ResourceNotFoundException("Billing not found with id: " + billingId));

        if (billing.getPaymentStatus() == PaymentStatus.PAID) {
            throw new BadRequestException("Bill is already paid");
        }

        billing.setPaymentStatus(PaymentStatus.PAID);
        return toResponse(billingRepository.save(billing));
    }

    private BillingResponse toResponse(Billing b) {
        return new BillingResponse(b.getId(), b.getBooking().getId(),
                b.getRoomCharges(), b.getServiceCharges(),
                b.getTotalAmount(), b.getPaymentStatus().name());
    }
}
