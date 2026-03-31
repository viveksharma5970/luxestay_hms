package com.hotel.dto.response;

public class DashboardResponse {

    private long totalBookings;
    private double totalRevenue;
    private long activeGuests;

    public DashboardResponse(long totalBookings, double totalRevenue, long activeGuests) {
        this.totalBookings = totalBookings;
        this.totalRevenue = totalRevenue;
        this.activeGuests = activeGuests;
    }

    public long getTotalBookings() { return totalBookings; }
    public double getTotalRevenue() { return totalRevenue; }
    public long getActiveGuests() { return activeGuests; }
}
