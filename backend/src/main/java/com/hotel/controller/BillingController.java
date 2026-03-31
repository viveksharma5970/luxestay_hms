package com.hotel.controller;

import com.hotel.dto.response.BillingResponse;
import com.hotel.service.BillingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @PostMapping("/generate/{bookingId}")
    public ResponseEntity<BillingResponse> generateBill(@PathVariable Long bookingId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(billingService.generateBill(bookingId));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<BillingResponse> getBillByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(billingService.getBillByBookingId(bookingId));
    }

    @PutMapping("/{billingId}/pay")
    public ResponseEntity<BillingResponse> markAsPaid(@PathVariable Long billingId) {
        return ResponseEntity.ok(billingService.markAsPaid(billingId));
    }
}
