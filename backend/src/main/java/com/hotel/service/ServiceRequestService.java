package com.hotel.service;

import com.hotel.dto.request.ServiceRequestDto;
import com.hotel.dto.response.ServiceRequestResponse;
import com.hotel.entity.Booking;
import com.hotel.entity.HotelService;
import com.hotel.entity.ServiceRequest;
import com.hotel.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final BookingService bookingService;
    private final HotelServiceMgmtService hotelServiceMgmtService;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository,
                                  BookingService bookingService,
                                  HotelServiceMgmtService hotelServiceMgmtService) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.bookingService = bookingService;
        this.hotelServiceMgmtService = hotelServiceMgmtService;
    }

    public ServiceRequestResponse requestService(ServiceRequestDto dto) {
        Booking booking = bookingService.findById(dto.getBookingId());
        HotelService service = hotelServiceMgmtService.findById(dto.getServiceId());

        ServiceRequest sr = new ServiceRequest();
        sr.setBooking(booking);
        sr.setService(service);

        return toResponse(serviceRequestRepository.save(sr));
    }

    public List<ServiceRequestResponse> getByBookingId(Long bookingId) {
        return serviceRequestRepository.findByBookingId(bookingId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private ServiceRequestResponse toResponse(ServiceRequest sr) {
        return new ServiceRequestResponse(sr.getId(), sr.getBooking().getId(),
                sr.getService().getId(), sr.getService().getName(), sr.getService().getPrice(),
                sr.getStatus().name(), sr.getRequestedAt());
    }
}
