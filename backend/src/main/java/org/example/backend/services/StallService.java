package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.AddStallRequest;
import org.example.backend.dtos.StallAvailabilityDto;
import org.example.backend.dtos.StallDto;
import org.example.backend.entities.Stall;
import org.example.backend.mappers.StallMapper;
import org.example.backend.repositories.EventRepository;
import org.example.backend.repositories.ReservationStallRepository;
import org.example.backend.repositories.StallRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
@AllArgsConstructor
public class StallService {
    private final EventRepository eventRepository;
    private final StallRepository stallRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final StallMapper stallMapper;

    public List<StallDto> listStalls() {
        return stallRepository.findAll().stream()
                .map(stallMapper::toDto)
                .toList();
    }

    public StallDto getStall(Long id) {
        return stallMapper.toDto(findStallById(id));
    }

    public StallDto createStall(AddStallRequest request) {
        var stall = stallMapper.toEntity(request);
        stall = stallRepository.save(stall);
        return stallMapper.toDto(stall);
    }

    public StallDto updateStall(Long id, AddStallRequest request) {
        var stall = findStallById(id);
        stallMapper.update(request, stall);
        stall = stallRepository.save(stall);
        return stallMapper.toDto(stall);
    }

    public void deleteStall(Long id) {
        var stall = findStallById(id);
        stallRepository.delete(stall);
    }

    public List<StallAvailabilityDto> listStallAvailability(Integer eventId) {
        eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event not found."));
        return buildAvailability(eventId);
    }

    private List<StallAvailabilityDto> buildAvailability(Integer eventId) {
        List<Long> reservedIds = reservationStallRepository.findActiveReservedStallIdsByEvent(eventId);
        Set<Long> reservedSet = new HashSet<>(reservedIds);

        return stallRepository.findAll().stream()
                .map(stall -> stallMapper.toAvailabilityDto(stall, reservedSet.contains(stall.getId())))
                .sorted(Comparator.comparing(StallAvailabilityDto::getStallCode, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    private Stall findStallById(Long id) {
        return stallRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Stall not found."));
    }
}
