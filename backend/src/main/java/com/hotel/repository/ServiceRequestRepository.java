package com.hotel.repository;

import com.hotel.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByBookingId(Long bookingId);

    @Query("SELECT COALESCE(SUM(sr.service.price), 0) FROM ServiceRequest sr WHERE sr.booking.id = :bookingId")
    Double sumServiceChargesByBookingId(@Param("bookingId") Long bookingId);
}
