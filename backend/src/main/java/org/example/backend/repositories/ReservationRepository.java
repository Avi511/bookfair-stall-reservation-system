package org.example.backend.repositories;

import org.example.backend.entities.Reservation;
import org.example.backend.entities.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    //find all reservations by user and event
    List<Reservation> findAllByUser_IdAndEvent_Id(Long userId, Integer eventId);

    @Query("""
        select coalesce(count(rs), 0)
        from Reservation r
        join r.reservationStalls rs
        where r.user.id = :userId
          and r.event.id = :eventId
          and r.status = :status
    """)
    long countStallsForUserInEventByStatus(
            @Param("userId") Long userId,
            @Param("eventId") Integer eventId,
            @Param("status") ReservationStatus status
    );

}