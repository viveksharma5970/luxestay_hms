package com.hotel.dto.response;

import java.time.LocalDateTime;

public class ServiceRequestResponse {

    private Long id;
    private Long bookingId;
    private Long serviceId;
    private String serviceName;
    private Double servicePrice;
    private String status;
    private LocalDateTime requestedAt;

    public ServiceRequestResponse(Long id, Long bookingId, Long serviceId, String serviceName,
                                   Double servicePrice, String status, LocalDateTime requestedAt) {
        this.id = id;
        this.bookingId = bookingId;
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.servicePrice = servicePrice;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    public Long getId() { return id; }
    public Long getBookingId() { return bookingId; }
    public Long getServiceId() { return serviceId; }
    public String getServiceName() { return serviceName; }
    public Double getServicePrice() { return servicePrice; }
    public String getStatus() { return status; }
    public LocalDateTime getRequestedAt() { return requestedAt; }
}
