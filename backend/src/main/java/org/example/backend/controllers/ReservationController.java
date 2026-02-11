package org.example.backend.controllers;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.MakeReservationRequest;

import org.example.backend.services.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;



@AllArgsConstructor
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;


    @PostMapping
    public ResponseEntity<?> makeReservation(
            @RequestBody MakeReservationRequest request
    ) {
        Long userId = (Long) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        return ResponseEntity.ok(reservationService.makeReservation(userId, request));
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteReservation(
//            @PathVariable Long id
//    ) {
//
//    }
//
//    @ExceptionHandler(IllegalArgumentException.class)
//    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
//        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
//    }
}
