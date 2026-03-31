package com.hotel.dto.response;

import java.time.LocalDate;

public class BookingResponse {

    private Long id;
    private Long userId;
    private String userName;
    private Long roomId;
    private String roomNumber;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;

    public BookingResponse(Long id, Long userId, String userName, Long roomId,
                           String roomNumber, LocalDate checkInDate,
                           LocalDate checkOutDate, String status) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public Long getRoomId() { return roomId; }
    public String getRoomNumber() { return roomNumber; }
    public LocalDate getCheckInDate() { return checkInDate; }
    public LocalDate getCheckOutDate() { return checkOutDate; }
    public String getStatus() { return status; }
}
