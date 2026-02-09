package org.example.backend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.MakeReservationRequest;
import org.example.backend.dtos.ReservationDto;
import org.example.backend.entities.*;
import org.example.backend.mappers.ReservationMapper;
import org.example.backend.repositories.ReservationRepository;
import org.example.backend.repositories.ReservationStallRepository;
import org.example.backend.repositories.StallRepository;
import org.example.backend.repositories.UserRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ReservationService {
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final StallRepository stallRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final ReservationMapper reservationMapper;


    @Transactional
    public ReservationDto makeReservation(Long userId, MakeReservationRequest request) {
        final int MAXIMUM_STALLS_PER_USER = 3;

        var user = userRepository.findById(userId).orElseThrow();
        if(user.getRole() != Role.USER) {
            throw new IllegalArgumentException("Only business user can make reservations.");
        }

        var event = eventRepository.findById(request.getEventId()).orElseThrow();
        if (event.getStatus() != EventStatus.ACTIVE) {
            throw new IllegalArgumentException("Event is not active.");
        }

        var requestedStallIds = request.getStallIds().stream().distinct().toList();
        if(requestedStallIds.isEmpty() || requestedStallIds.size() > MAXIMUM_STALLS_PER_USER) {
            throw new  IllegalArgumentException("You must reserve 1 to 3 stalls.");
        }

        var stalls = stallRepository.findAllById(requestedStallIds);
        if(stalls.size() != request.getStallIds().size()) {
            throw new IllegalArgumentException("One or more stall IDs are invalid");
        }

        long alreadyConfirmedCount = reservationRepository.countStallsForUserInEventByStatus(
                userId,
                request.getEventId(),
                ReservationStatus.CONFIRMED
        );

        if(alreadyConfirmedCount + requestedStallIds.size() > MAXIMUM_STALLS_PER_USER) {
            throw new IllegalArgumentException("Max 3 stalls per event.");
        }

        boolean anyToken = reservationStallRepository.anyReservedInEvent(
                request.getEventId(),
                requestedStallIds,
                ReservationStatus.CONFIRMED
        );
        if(anyToken) {
            throw new IllegalArgumentException("One or more stalls are already reserved.");
        }

        var reservation = Reservation.builder()
                .user(user)
                .event(event)
                .status(ReservationStatus.CONFIRMED)
                .build();

        reservation = reservationRepository.save(reservation);

        for(var stall: stalls) {
            var rs = new ReservationStall(
                    reservation,
                    stall,
                    event
            );
            reservation.getReservationStalls().add(rs);
        }
        System.out.println("links = " + reservation.getReservationStalls().size());

        reservationRepository.save(reservation);

        return reservationMapper.toDto(reservation);
    }
}
