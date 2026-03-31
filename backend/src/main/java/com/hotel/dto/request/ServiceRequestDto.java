package com.hotel.dto.request;

import jakarta.validation.constraints.NotNull;

public class ServiceRequestDto {

    @NotNull
    private Long bookingId;

    @NotNull
    private Long serviceId;

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
}
