package com.hotel.service;

import com.hotel.dto.request.RoomRequest;
import com.hotel.dto.response.RoomResponse;
import com.hotel.entity.Room;
import com.hotel.entity.Room.RoomStatus;
import com.hotel.exception.BadRequestException;
import com.hotel.exception.ResourceNotFoundException;
import com.hotel.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public RoomResponse createRoom(RoomRequest request) {
        if (roomRepository.existsByRoomNumber(request.getRoomNumber())) {
            throw new BadRequestException("Room number already exists: " + request.getRoomNumber());
        }
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setPrice(request.getPrice());
        room.setStatus(RoomStatus.AVAILABLE);
        return toResponse(roomRepository.save(room));
    }

    public RoomResponse updateRoom(Long id, RoomRequest request) {
        Room room = findById(id);
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setPrice(request.getPrice());
        return toResponse(roomRepository.save(room));
    }

    public void deleteRoom(Long id) {
        roomRepository.delete(findById(id));
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    public List<RoomResponse> getAvailableRooms() {
        return roomRepository.findByStatus(RoomStatus.AVAILABLE)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    public Room findById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
    }

    private RoomResponse toResponse(Room room) {
        return new RoomResponse(room.getId(), room.getRoomNumber(),
                room.getType(), room.getPrice(), room.getStatus().name());
    }
}
