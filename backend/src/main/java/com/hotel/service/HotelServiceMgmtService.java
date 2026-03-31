package com.hotel.service;

import com.hotel.dto.request.HotelServiceRequest;
import com.hotel.entity.HotelService;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.HotelServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelServiceMgmtService {

    private final HotelServiceRepository hotelServiceRepository;

    public HotelServiceMgmtService(HotelServiceRepository hotelServiceRepository) {
        this.hotelServiceRepository = hotelServiceRepository;
    }

    public HotelService createService(HotelServiceRequest request) {
        HotelService service = new HotelService();
        service.setName(request.getName());
        service.setPrice(request.getPrice());
        return hotelServiceRepository.save(service);
    }

    public List<HotelService> getAllServices() {
        return hotelServiceRepository.findAll();
    }

    public HotelService findById(Long id) {
        return hotelServiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
    }

    public void deleteService(Long id) {
        hotelServiceRepository.delete(findById(id));
    }
}
