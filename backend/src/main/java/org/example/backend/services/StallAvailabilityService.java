package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.EventStallAvailabilityDto;
import org.example.backend.dtos.StallAvailabilityDto;
import org.example.backend.entities.Event;
import org.example.backend.entities.ReservationStatus;
import org.example.backend.entities.Stall;
import org.example.backend.repositories.EventRepository;
import org.example.backend.repositories.ReservationRepository;
import org.example.backend.repositories.StallRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
@AllArgsConstructor
public class StallAvailabilityService {

    private final EventRepository eventRepository;
    private final StallRepository stallRepository;
    private final ReservationRepository reservationRepository;

    public EventStallAvailabilityDto getAvailability(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NoSuchElementException("Event not found."));

        List<Long> reservedIds = reservationRepository.findReservedStallIdsByEvent(
                eventId,
                ReservationStatus.CONFIRMED
        );
        Set<Long> reservedSet = new HashSet<>(reservedIds);

        List<StallAvailabilityDto> stalls = stallRepository.findAll().stream()
                .map(stall -> toDto(stall, reservedSet.contains(stall.getId())))
                .sorted(
                        Comparator.comparing(
                                StallAvailabilityDto::getStallCode,
                                String.CASE_INSENSITIVE_ORDER
                        )
                )
                .toList();

        EventStallAvailabilityDto response = new EventStallAvailabilityDto();
        response.setEventId(event.getId());
        response.setEventStatus(event.getStatus());
        response.setStalls(stalls);
        return response;
    }

    private StallAvailabilityDto toDto(Stall stall, boolean reserved) {
        StallAvailabilityDto dto = new StallAvailabilityDto();
        dto.setId(stall.getId());
        dto.setStallCode(stall.getStallCode());
        dto.setSize(stall.getSize());
        dto.setXPosition(stall.getXPosition());
        dto.setYPosition(stall.getYPosition());
        dto.setReserved(reserved);
        return dto;
    }
}
