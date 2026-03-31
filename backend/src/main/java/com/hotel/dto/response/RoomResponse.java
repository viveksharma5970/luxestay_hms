package com.hotel.dto.response;

public class RoomResponse {

    private Long id;
    private String roomNumber;
    private String type;
    private Double price;
    private String status;

    public RoomResponse(Long id, String roomNumber, String type, Double price, String status) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.type = type;
        this.price = price;
        this.status = status;
    }

    public Long getId() { return id; }
    public String getRoomNumber() { return roomNumber; }
    public String getType() { return type; }
    public Double getPrice() { return price; }
    public String getStatus() { return status; }
}
