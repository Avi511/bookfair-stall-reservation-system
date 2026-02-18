package org.example.backend.controllers;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.MakeReservationRequest;
import org.example.backend.dtos.UpdateReservationGenresRequest;
import org.example.backend.dtos.UpdateReservationRequest;
import org.example.backend.entities.ReservationStatus;
import org.example.backend.services.AuthService;
import org.example.backend.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final AuthService authService;

    @GetMapping("/me")
    public ResponseEntity<?> getMyReservations(
            @RequestParam(required = false) Integer eventId
    ) {
        return ResponseEntity.ok(reservationService.listReservations(authService.getCurrentUserId(), eventId));
    }

    @GetMapping
    public ResponseEntity<?> getReservations(
            @RequestParam(required = false) Integer eventId,
            @RequestParam(required = false) ReservationStatus status,
            @RequestParam(required = false) Long userId
    ) {
        return ResponseEntity.ok(reservationService.listReservationsFiltered(eventId, status, userId));
    }

    @PostMapping
    public ResponseEntity<?> makeReservation(
            @Valid @RequestBody MakeReservationRequest request,
            UriComponentsBuilder uriBuilder
    ) {
        var reservationDto = reservationService.makeReservation(authService.getCurrentUserId(), request);
        var uri = uriBuilder.path("/api/reservations/{id}").buildAndExpand(reservationDto.getId()).toUri();
        return ResponseEntity.created(uri).body(reservationDto);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> cancelReservation(
            @PathVariable(name = "id") Long reservationId
    ) {
        var reservationDto =  reservationService.cancelReservation(authService.getCurrentUserId(), reservationId);
        return  ResponseEntity.ok(reservationDto);
    }

    @PutMapping("/{id}/stalls")
    public ResponseEntity<?> updateReservation(
            @PathVariable(name = "id") Long reservationId,
            @Valid @RequestBody UpdateReservationRequest request
    ) {
        var reservationDto = reservationService.updateReservation(
                authService.getCurrentUserId(),
                reservationId,
                request.getStallIds()
        );
        return ResponseEntity.ok(reservationDto);
    }

    @PutMapping("/employee/{id}")
    public ResponseEntity<?> cancelReservationByEmployee(
            @PathVariable(name = "id") Long reservationId
    ) {
        var reservationDto = reservationService.cancelReservation(
                reservationId
        );
        return ResponseEntity.ok(reservationDto);
    }

    @PutMapping("/{id}/genres")
    public ResponseEntity<?> addGenres(
            @PathVariable(name = "id") Long reservationId,
            @Valid @RequestBody UpdateReservationGenresRequest request
    ) {
        var genres = reservationService.addReservationGenres(
                authService.getCurrentUserId(),
                reservationId,
                request.getGenreIds()
        );
        return ResponseEntity.ok(genres);
    }

    @GetMapping("/{id}/genres")
    public ResponseEntity<?> listGenres(
            @PathVariable(name = "id") Long reservationId
    ) {
        var genres = reservationService.listReservationGenres(
                authService.getCurrentUserId(),
                reservationId
        );
        return ResponseEntity.ok(genres);
    }
}
