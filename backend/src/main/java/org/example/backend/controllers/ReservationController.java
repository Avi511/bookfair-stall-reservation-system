package org.example.backend.controllers;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.MakeReservationRequest;
import org.example.backend.entities.Reservation;
import org.example.backend.repositories.ReservationRepository;
import org.example.backend.repositories.StallRepository;
import org.example.backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final StallRepository stallRepository;

    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> makeReservation(
            @RequestBody MakeReservationRequest request
    ) {
            var user =  userRepository.findById(request.getUserId()).orElse(null);

            if(user == null) {
                return ResponseEntity.badRequest().build();
            }

            if(reservationRepository.existsByUser(user)) {
                return ResponseEntity.badRequest().build();
            }

            if(request.getStallIds().size() > 3 ) {
                return ResponseEntity.badRequest().build();
            }

            var reservation = Reservation.builder()
                    .user(user)
                    .build();

            for (var stallId : request.getStallIds()) {
                var stall = stallRepository.findById(stallId).orElse(null);
                if(stall == null || stall.getIsReserved() == true) {
                    return ResponseEntity.badRequest().build();
                }
                reservation.addStall(stall);
            }

            reservationRepository.save(reservation);
            return  ResponseEntity.ok().body(reservation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(
            @PathVariable Long id
    ) {
            var reservation = reservationRepository.findById(id).orElse(null);
            if(reservation == null)
                return ResponseEntity.badRequest().build();

            for (var stall: reservation.getStalls() ) {
                stall.setIsReserved(false);
            }

            reservationRepository.delete(reservation);
            return ResponseEntity.noContent().build();
    }
}
