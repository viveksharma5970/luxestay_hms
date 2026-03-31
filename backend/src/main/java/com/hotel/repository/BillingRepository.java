package com.hotel.repository;

import com.hotel.entity.Billing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

public interface BillingRepository extends JpaRepository<Billing, Long> {

    Optional<Billing> findByBookingId(Long bookingId);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Billing b WHERE b.paymentStatus = 'PAID'")
    Double getTotalRevenue();
}
