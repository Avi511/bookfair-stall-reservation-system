package org.example.backend.controllers;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.MakeReservationRequest;
import org.example.backend.entities.Reservation;
import org.example.backend.entities.Stall;
import org.example.backend.repositories.StallRepository;
import org.example.backend.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {
    private final UserRepository userRepository;
    private final ReservationRepository reservationRepository;
    private final StallRepository stallRepository;

    @PostMapping
    public ResponseEntity<?> makeReservation(
            @RequestBody MakeReservationRequest request
    ) {
            var user =  userRepository.findById(request.getUserId()).orElse(null);

            if(user == null) {
                return ResponseEntity.badRequest().build();
            }

            if(request.getStallIds().size() > 3 ) {
                return ResponseEntity.badRequest().build();
            }

            Set<Stall> stalls = new HashSet<>();

            for (var stallId : request.getStallIds()) {
                var stall = stallRepository.findById(stallId).orElse(null);
                if(stall == null) {
                    return ResponseEntity.badRequest().build();
                }
                stalls.add(stall);
            }

            var reservation = Reservation.builder()
                    .user(user)
                    .stalls(stalls)
                    .qrCodePath("casbhasgfsafasgfgasas")
                    .build();

            reservationRepository.save(reservation);
            return  ResponseEntity.ok().body(reservation);

    }
}
