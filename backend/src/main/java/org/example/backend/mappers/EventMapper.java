package org.example.backend.mappers;

import org.example.backend.dtos.CreateEventRequest;
import org.example.backend.dtos.EventDto;
import org.example.backend.dtos.UpdateEventRequest;
import org.example.backend.entities.Event;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface EventMapper {
    EventDto toDto(Event event);

    Event toEntity(CreateEventRequest request);

    void update(UpdateEventRequest request, @MappingTarget Event event);
}
