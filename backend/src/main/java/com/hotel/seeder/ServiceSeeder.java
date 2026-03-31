package com.hotel.seeder;

import com.hotel.entity.HotelService;
import com.hotel.repository.HotelServiceRepository;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(4)
public class ServiceSeeder implements Seeder {

    private final HotelServiceRepository hotelServiceRepository;

    public ServiceSeeder(HotelServiceRepository hotelServiceRepository) {
        this.hotelServiceRepository = hotelServiceRepository;
    }

    @Override
    public void seed() {
        if (hotelServiceRepository.count() > 0) return;

        // name, price
        List<Object[]> services = List.of(
            new Object[]{"Gym Access",       15.00},
            new Object[]{"Swimming Pool",    20.00},
            new Object[]{"Laundry",          25.00},
            new Object[]{"Room Service",     30.00},
            new Object[]{"Breakfast",        18.00},
            new Object[]{"Airport Transfer", 50.00},
            new Object[]{"Spa & Massage",    80.00},
            new Object[]{"Car Rental",      120.00}
        );

        for (Object[] s : services) {
            HotelService service = new HotelService();
            service.setName((String) s[0]);
            service.setPrice((Double) s[1]);
            hotelServiceRepository.save(service);
        }

        System.out.println("✅ ServiceSeeder: 8 hotel services seeded");
    }
}
