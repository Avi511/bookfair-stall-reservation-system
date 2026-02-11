package org.example.backend.dtos;

import lombok.Data;
import org.example.backend.entities.EventStatus;

import java.util.List;

@Data
public class EventStallAvailabilityDto {
    private Integer eventId;
    private EventStatus eventStatus;
    private List<StallAvailabilityDto> stalls;
}