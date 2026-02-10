package org.example.backend.repositories;

import org.example.backend.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    //find all reservations by user and event
    List<Reservation> findAllByUser_IdAndEvent_Id(Long userId, Integer eventId);
    List<Reservation> findAllByUser_Id(Long userId);

    @Query("""
        select coalesce(count(rs), 0)
        from Reservation r
        join r.reservationStalls rs
        where r.user.id = :userId
          and r.event.id = :eventId
          and r.status = 'CONFIRMED'
          and rs.active = true
    """)
    int countActiveConfirmedStallsForUserInEvent(
            @Param("userId") Long userId,
            @Param("eventId") Integer eventId
    );

    @Query("""
        select distinct r
        from Reservation r
        left join fetch r.event e
        left join fetch r.reservationStalls rs
        left join fetch rs.stall s
        where r.user.id = :userId
    """)
    List<Reservation> findAllByUserIdWithStalls(@Param("userId") Long userId);

    @Query("""
        select distinct r
        from Reservation r
        left join fetch r.reservationStalls rs
        left join fetch rs.stall s
        where r.user.id = :userId
          and r.event.id = :eventId
    """)
    List<Reservation> findAllByUserIdAndEventIdWithStalls(
            @Param("userId") Long userId,
            @Param("eventId") Integer eventId
    );

    @Query("""
        select r
        from Reservation r
        left join fetch r.reservationStalls rs
        left join fetch rs.stall s
        left join fetch r.event e
        where r.id = :id
    """)
    Reservation findByIdWithStalls(@Param("id") Long id);

}
