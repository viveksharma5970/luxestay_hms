package com.hotel.controller;

import com.hotel.dto.request.HotelServiceRequest;
import com.hotel.dto.request.ServiceRequestDto;
import com.hotel.dto.response.ServiceRequestResponse;
import com.hotel.entity.HotelService;
import com.hotel.service.HotelServiceMgmtService;
import com.hotel.service.ServiceRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;
    private final HotelServiceMgmtService hotelServiceMgmtService;

    public ServiceRequestController(ServiceRequestService serviceRequestService,
                                     HotelServiceMgmtService hotelServiceMgmtService) {
        this.serviceRequestService = serviceRequestService;
        this.hotelServiceMgmtService = hotelServiceMgmtService;
    }

    // Admin: manage available services
    @PostMapping("/manage")
    public ResponseEntity<HotelService> createService(@Valid @RequestBody HotelServiceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hotelServiceMgmtService.createService(request));
    }

    @GetMapping
    public ResponseEntity<List<HotelService>> getAllServices() {
        return ResponseEntity.ok(hotelServiceMgmtService.getAllServices());
    }

    @DeleteMapping("/manage/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        hotelServiceMgmtService.deleteService(id);
        return ResponseEntity.noContent().build();
    }

    // Guest: request a service
    @PostMapping("/request")
    public ResponseEntity<ServiceRequestResponse> requestService(@Valid @RequestBody ServiceRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceRequestService.requestService(dto));
    }

    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<ServiceRequestResponse>> getServicesByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(serviceRequestService.getByBookingId(bookingId));
    }
}
