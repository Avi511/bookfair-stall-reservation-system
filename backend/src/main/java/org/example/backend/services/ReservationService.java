package org.example.backend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.GenreDto;
import org.example.backend.dtos.MakeReservationRequest;
import org.example.backend.dtos.ReservationDto;
import org.example.backend.entities.*;
import org.example.backend.mappers.GenreMapper;
import org.example.backend.mappers.ReservationMapper;
import org.example.backend.repositories.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@AllArgsConstructor
public class ReservationService {
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final StallRepository stallRepository;
    private final GenreRepository genreRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationStallRepository reservationStallRepository;
    private final ReservationMapper reservationMapper;
    private final GenreMapper genreMapper;
    private final QrCodeService qrCodeService;
    private final EmailService emailService;
    private final AuthService authService;

    @Transactional
    public List<ReservationDto> listReservations(Long userId, Integer eventId) {
        var user = userRepository.findById(userId).orElseThrow();
        if (user.getRole() != Role.USER) {
            throw new IllegalArgumentException("Only business user can view reservations.");
        }

        var reservations = eventId == null
                ? reservationRepository.findAllByUserIdWithStalls(userId)
                : reservationRepository.findAllByUserIdAndEventIdWithStalls(userId, eventId);

        return reservations.stream()
                .map(reservationMapper::toDto)
                .toList();
    }

    @Transactional
    public List<ReservationDto> listReservationsFiltered(Integer eventId, ReservationStatus status, Long userId) {
        if (eventId != null) {
            eventRepository.findById(eventId)
                    .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        }

        var reservations = reservationRepository.findAllWithFilters(eventId, status, userId);
        return reservations.stream()
                .map(reservationMapper::toDto)
                .toList();
    }

    @Transactional
    public ReservationDto makeReservation(Long userId, MakeReservationRequest request) {
        final int MAXIMUM_STALLS_PER_USER = 3;

        var user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        if(user.getRole() != Role.USER) {
            throw new IllegalArgumentException("Only business user can make reservations.");
        }

        var event = eventRepository.findById(request.getEventId()).orElseThrow(() -> new IllegalArgumentException("Event not found"));
        if (event.getStatus() != EventStatus.ACTIVE) {
            throw new IllegalArgumentException("Event is not active.");
        }
        ensureEventNotEnded(event);

        var requestedStallIds = request.getStallIds().stream().distinct().toList();
        if(requestedStallIds.isEmpty() || requestedStallIds.size() > MAXIMUM_STALLS_PER_USER) {
            throw new  IllegalArgumentException("You must reserve 1 to 3 stalls.");
        }

        var stalls = stallRepository.findAllById(requestedStallIds);
        if(stalls.size() != requestedStallIds.size()) {
            throw new IllegalArgumentException("One or more stall IDs are invalid");
        }

        long alreadyConfirmedActiveCount = reservationRepository.countActiveConfirmedStallsForUserInEvent(
                userId,
                request.getEventId()
        );

        if(alreadyConfirmedActiveCount + requestedStallIds.size() > MAXIMUM_STALLS_PER_USER) {
            throw new IllegalArgumentException("Max 3 stalls per event.");
        }

        boolean anyToken = reservationStallRepository.anyActiveReservedInEvent(
                request.getEventId(),
                requestedStallIds
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
                    event,
                    true
            );
            reservation.getReservationStalls().add(rs);
        }

        reservationRepository.save(reservation);

        sendReservationQr(user, reservation);
        return reservationMapper.toDto(reservation);
    }

    @Transactional
    public ReservationDto cancelReservation(Long userId, Long reservationId) {
        var reservation = requireOwnedReservation(
                userId,
                reservationId,
                "User can only cancel own reservation."
        );

        return getReservationDto(reservationId, reservation);
    }

    @Transactional
    public ReservationDto cancelReservation(Long reservationId) {
        var reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        return getReservationDto(reservationId, reservation);
    }

    private ReservationDto getReservationDto(Long reservationId, Reservation reservation) {
        if(reservation.getStatus() == ReservationStatus.CANCELLED) {
            return reservationMapper.toDto(reservation);
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationStallRepository.deactivateByReservationId(reservationId);
        reservationRepository.save(reservation);

        var fresh = reservationRepository.findByIdWithStalls(reservationId);
        return reservationMapper.toDto(fresh);
    }


    @Transactional
    public ReservationDto updateReservation(Long userId, Long reservationId, List<Long> newStallIds) {
        final int MAX_STALLS_PER_USER = 3;

        var reservation = requireOwnedConfirmedActiveReservation(
                userId,
                reservationId
        );

        var distinctNew = newStallIds.stream().distinct().toList();
        if(distinctNew.isEmpty() || distinctNew.size() > MAX_STALLS_PER_USER) {
            throw new IllegalArgumentException("You must reserve 1 to 3 stalls.");
        }



        var currentActive = reservationStallRepository.findActiveStallIds(reservationId);

        int currentCount = currentActive.size();
        int newCount = distinctNew.size();
        int delta = newCount - currentCount;
        long alreadyActive = reservationRepository.countActiveConfirmedStallsForUserInEvent(userId, reservation.getEvent().getId());
        long newTotal = alreadyActive + delta;
        if(newTotal > MAX_STALLS_PER_USER) {
            throw new IllegalArgumentException("Max 3 stalls per event.");
        }


        var toRemove = currentActive.stream().filter(id -> !distinctNew.contains(id)).toList();
        var toAdd = distinctNew.stream().filter(id -> !currentActive.contains(id)).toList();


        if (!toAdd.isEmpty()) {
            boolean anyTaken = reservationStallRepository.anyActiveReservedInEvent(
                    reservation.getEvent().getId(),
                    toAdd
            );
            if (anyTaken) {
                throw new IllegalArgumentException("One or more stalls are already reserved.");
            }
        }

        if (!toRemove.isEmpty()) {
            reservationStallRepository.deleteReservationStalls(reservationId, toRemove);
        }

        if (!toAdd.isEmpty()) {
            var stallsToInsert = stallRepository.findAllById(toAdd);
            if (stallsToInsert.size() != toAdd.size()) {
                throw new IllegalArgumentException("One or more stall IDs are invalid");
            }

            for (var stall : stallsToInsert) {
                var rs = new ReservationStall(reservation, stall, reservation.getEvent(), true);
                reservation.getReservationStalls().add(rs);
            }
        }

        reservationRepository.save(reservation);
        var fresh = reservationRepository.findByIdWithStalls(reservationId);
        return reservationMapper.toDto(fresh);
    }

    @Transactional
    public List<GenreDto> addReservationGenres(Long userId, Long reservationId, List<Integer> genreIds) {
        var reservation = requireOwnedConfirmedActiveReservation(
                userId,
                reservationId
        );

        var distinctIds = genreIds.stream().distinct().toList();
        if (distinctIds.isEmpty()) {
            throw new IllegalArgumentException("You must select at least 1 genre.");
        }

        var genres = genreRepository.findAllById(distinctIds);
        if (genres.size() != distinctIds.size()) {
            throw new IllegalArgumentException("One or more genre IDs are invalid");
        }

        reservation.getGenres().addAll(genres);
        reservationRepository.save(reservation);

        return reservation.getGenres().stream()
                .map(genreMapper::toDto)
                .toList();
    }

    @Transactional
    public List<GenreDto> listReservationGenres(Long userId, Long reservationId) {
        var reservation = requireOwnedReservation(
                userId,
                reservationId,
                "User can only view own reservation."
        );

        return reservation.getGenres().stream()
                .map(genreMapper::toDto)
                .toList();
    }

    private Reservation requireOwnedConfirmedActiveReservation(Long userId, Long reservationId) {
        var reservation = requireOwnedReservation(userId, reservationId, "User can only update own reservation.");

        if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
            throw new IllegalArgumentException("Reservation is not confirmed.");
        }

        if (reservation.getEvent().getStatus() != EventStatus.ACTIVE) {
            throw new IllegalArgumentException("Event is not active.");
        }

        ensureEventNotEnded(reservation.getEvent());

        return reservation;
    }

    private Reservation requireOwnedReservation(Long userId, Long reservationId, String notOwnerMessage) {
        var reservation = reservationRepository.findById(reservationId).orElseThrow(
                () -> new IllegalArgumentException("Reservation not found")
        );

        if (!reservation.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException(notOwnerMessage);
        }

        return reservation;
    }

    private void sendReservationQr(User user, Reservation reservation) {
        try {
            String qrString = reservation.getQrToken().toString();
            byte[] qrPng = qrCodeService.generatePng(qrString);
            emailService.sendReservationConfirmation(user, reservation, qrPng);
        } catch (Exception e) {
            System.err.println("QR email failed: " + e.getMessage());
        }
    }

    private void ensureEventNotEnded(Event event) {
        var endDate = event.getEndDate();
        if (endDate == null) {
            return;
        }
        var today = LocalDate.now(ZoneId.systemDefault());
        var endLocalDate = endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (endLocalDate.isBefore(today)) {
            throw new IllegalArgumentException("Event end date has passed.");
        }
    }

}
