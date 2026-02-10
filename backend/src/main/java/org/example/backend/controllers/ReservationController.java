package org.example.backend.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.MakeReservationRequest;
import org.example.backend.dtos.ReservationDto;
import org.example.backend.dtos.UpdateReservationRequest;
import org.example.backend.entities.Reservation;
import org.example.backend.repositories.ReservationRepository;
import org.example.backend.repositories.StallRepository;
import org.example.backend.repositories.UserRepository;
import org.example.backend.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.Set;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyReservations(
            @RequestParam(required = false) Integer eventId
    ) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(reservationService.listReservations(userId, eventId));
    }


    @PostMapping
    public ResponseEntity<?> makeReservation(
            @Valid @RequestBody MakeReservationRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        var reservationDto = reservationService.makeReservation(userId, request);
        var uri = uriBuilder.path("/api/reservations/{id}").buildAndExpand(reservationDto.getId()).toUri();
        return ResponseEntity.created(uri).body(reservationDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> cancelReservation(
            @PathVariable(name = "id") Long reservatioId
    ) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        var reservationDto =  reservationService.cancelReservation(userId, reservatioId);
        return  ResponseEntity.ok(reservationDto);
    }

    @PatchMapping("/{id}/stalls")
    public ResponseEntity<?> updateReservation(
            @PathVariable(name = "id") Long reservationId,
            @Valid @RequestBody UpdateReservationRequest request
    ) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        var reservationDto = reservationService.updateReservation(
                userId,
                reservationId,
                request.getStallIds()
        );
        return ResponseEntity.ok(reservationDto);
    }


    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
}
