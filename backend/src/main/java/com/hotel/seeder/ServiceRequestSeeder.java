package com.hotel.seeder;

import com.hotel.entity.Booking;
import com.hotel.entity.HotelService;
import com.hotel.entity.ServiceRequest;
import com.hotel.entity.ServiceRequest.RequestStatus;
import com.hotel.repository.BookingRepository;
import com.hotel.repository.HotelServiceRepository;
import com.hotel.repository.ServiceRequestRepository;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(6)
public class ServiceRequestSeeder implements Seeder {

    private final ServiceRequestRepository serviceRequestRepository;
    private final BookingRepository bookingRepository;
    private final HotelServiceRepository hotelServiceRepository;

    public ServiceRequestSeeder(ServiceRequestRepository serviceRequestRepository,
                                 BookingRepository bookingRepository,
                                 HotelServiceRepository hotelServiceRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.bookingRepository = bookingRepository;
        this.hotelServiceRepository = hotelServiceRepository;
    }

    @Override
    public void seed() {
        if (serviceRequestRepository.count() > 0) return;

        List<Booking> bookings = bookingRepository.findAll();
        List<HotelService> services = hotelServiceRepository.findAll();

        if (bookings.isEmpty() || services.isEmpty()) return;

        List<Object[]> requests = List.of(
            new Object[]{0, 0, RequestStatus.COMPLETED},
            new Object[]{0, 2, RequestStatus.COMPLETED},
            new Object[]{1, 4, RequestStatus.PENDING},
            new Object[]{2, 3, RequestStatus.COMPLETED},
            new Object[]{3, 6, RequestStatus.PENDING},
            new Object[]{4, 1, RequestStatus.IN_PROGRESS},
            new Object[]{4, 2, RequestStatus.PENDING},
            new Object[]{7, 5, RequestStatus.COMPLETED}
        );

        int count = 0;
        for (Object[] req : requests) {
            int bIdx = (int) req[0];
            int sIdx = (int) req[1];
            if (bIdx >= bookings.size() || sIdx >= services.size()) continue;

            ServiceRequest sr = new ServiceRequest();
            sr.setBooking(bookings.get(bIdx));
            sr.setService(services.get(sIdx));
            sr.setStatus((RequestStatus) req[2]);
            sr.setRequestedAt(LocalDateTime.now().minusDays(bIdx + 1));
            serviceRequestRepository.save(sr);
            count++;
        }

        System.out.println("✅ ServiceRequestSeeder: " + count + " service requests seeded");
    }
}
