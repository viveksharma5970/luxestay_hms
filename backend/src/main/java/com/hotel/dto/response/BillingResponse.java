package com.hotel.dto.response;

public class BillingResponse {

    private Long id;
    private Long bookingId;
    private Double roomCharges;
    private Double serviceCharges;
    private Double totalAmount;
    private String paymentStatus;

    public BillingResponse(Long id, Long bookingId, Double roomCharges,
                           Double serviceCharges, Double totalAmount, String paymentStatus) {
        this.id = id;
        this.bookingId = bookingId;
        this.roomCharges = roomCharges;
        this.serviceCharges = serviceCharges;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
    }

    public Long getId() { return id; }
    public Long getBookingId() { return bookingId; }
    public Double getRoomCharges() { return roomCharges; }
    public Double getServiceCharges() { return serviceCharges; }
    public Double getTotalAmount() { return totalAmount; }
    public String getPaymentStatus() { return paymentStatus; }
}
