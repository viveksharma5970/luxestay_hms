package com.hotel.repository;

import com.hotel.entity.Room;
import com.hotel.entity.Room.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(RoomStatus status);
    boolean existsByRoomNumber(String roomNumber);
}
