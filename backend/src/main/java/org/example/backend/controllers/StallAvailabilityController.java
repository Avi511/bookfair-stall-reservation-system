package org.example.backend.controllers;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.EventStallAvailabilityDto;
import org.example.backend.services.StallAvailabilityService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.NoSuchElementException;

@AllArgsConstructor
@RestController
@RequestMapping("/api/events")
public class StallAvailabilityController {

    private final StallAvailabilityService stallAvailabilityService;

    @GetMapping("/{eventId}/stalls/availability")
    public ResponseEntity<EventStallAvailabilityDto> getAvailability(
            @PathVariable Long eventId
    ) {
        return ResponseEntity.ok(
                stallAvailabilityService.getAvailability(eventId)
        );
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(
            NoSuchElementException ex
    ) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", ex.getMessage()));
    }
}
