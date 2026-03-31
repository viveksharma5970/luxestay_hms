package com.hotel.repository;

import com.hotel.entity.HotelService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelServiceRepository extends JpaRepository<HotelService, Long> {
}
