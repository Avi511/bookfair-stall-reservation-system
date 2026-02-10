package org.example.backend.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.CreateEventRequest;
import org.example.backend.dtos.EventDto;
import org.example.backend.dtos.UpdateEventRequest;
import org.example.backend.dtos.UpdateEventStatusRequest;
import org.example.backend.entities.EventStatus;
import org.example.backend.services.EventService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@AllArgsConstructor
@RestController
@RequestMapping("/api/employees/events")
public class EmployeeEventController {
    private final EventService eventService;

    @GetMapping
    public List<EventDto> getEvents(
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) Integer year
    ) {
        return eventService.listEvents(status, year);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEvent(@PathVariable Integer id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(
            @Valid @RequestBody CreateEventRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        var dto = eventService.createEvent(request);
        var uri = uriBuilder.path("/api/employees/events/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDto> updateEvent(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateEventRequest request
    ) {
        return ResponseEntity.ok(eventService.updateEvent(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<EventDto> updateStatus(
            @PathVariable Integer id,
            @Valid @RequestBody UpdateEventStatusRequest request
    ) {
        return ResponseEntity.ok(eventService.updateStatus(id, request.getStatus()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(
            IllegalArgumentException ex
    ) {
        return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFoundException(
            NoSuchElementException ex
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", ex.getMessage()));
    }
}
