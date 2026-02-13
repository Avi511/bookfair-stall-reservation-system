package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.CreateEventRequest;
import org.example.backend.dtos.EventDto;
import org.example.backend.dtos.UpdateEventRequest;
import org.example.backend.entities.Event;
import org.example.backend.entities.EventStatus;
import org.example.backend.mappers.EventMapper;
import org.example.backend.repositories.EventRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@AllArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final EventMapper eventMapper;

    public List<EventDto> listEvents(EventStatus status, Integer year) {
        return eventRepository.findAll().stream()
                .filter(event -> status == null || event.getStatus() == status)
                .filter(event -> year == null || year.equals(event.getYear()))
                .sorted(Comparator.comparing(Event::getYear).reversed()
                        .thenComparing(Event::getName, String.CASE_INSENSITIVE_ORDER))
                .map(eventMapper::toDto)
                .toList();
    }

    public EventDto getEvent(Integer id) {
        return eventMapper.toDto(findEventById(id));
    }

    public EventDto createEvent(CreateEventRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());
        ensureUniqueNameYear(request.getName(), request.getYear(), null);

        var event = eventMapper.toEntity(request);
        if (event.getStatus() == null) {
            event.setStatus(EventStatus.DRAFT);
        }

        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    public EventDto updateEvent(Integer id, UpdateEventRequest request) {
        validateDates(request.getStartDate(), request.getEndDate());
        ensureUniqueNameYear(request.getName(), request.getYear(), id);

        var event = findEventById(id);
        eventMapper.update(request, event);

        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    public EventDto updateStatus(Integer id, EventStatus status) {
        var event = findEventById(id);
        if (event.getStatus() == EventStatus.ENDED && status != EventStatus.ENDED) {
            throw new IllegalArgumentException("Ended events cannot be reactivated.");
        }

        event.setStatus(status);
        event = eventRepository.save(event);
        return eventMapper.toDto(event);
    }

    private Event findEventById(Integer id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Event not found."));
    }

    private void validateDates(Date startDate, Date endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Start date and end date are required.");
        }
        if (startDate.after(endDate)) {
            throw new IllegalArgumentException("Start date must be on or before end date.");
        }
    }

    private void ensureUniqueNameYear(String name, Integer year, Integer eventId) {
        boolean exists = eventRepository.findAll().stream()
                .anyMatch(event -> event.getName().equalsIgnoreCase(name)
                        && event.getYear().equals(year)
                        && (eventId == null || !event.getId().equals(eventId)));

        if (exists) {
            throw new IllegalArgumentException("Event name and year must be unique.");
        }
    }
}
