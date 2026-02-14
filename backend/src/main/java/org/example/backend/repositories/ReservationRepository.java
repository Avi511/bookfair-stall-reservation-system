package org.example.backend.repositories;

import org.example.backend.entities.Reservation;
import org.example.backend.entities.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

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
        select distinct r
        from Reservation r
        left join fetch r.reservationStalls rs
        left join fetch rs.stall s
        left join fetch r.genres g
        where (:eventId is null or r.event.id = :eventId)
          and (:status is null or r.status = :status)
          and (:userId is null or r.user.id = :userId)
    """)
    List<Reservation> findAllWithFilters(
            @Param("eventId") Integer eventId,
            @Param("status") ReservationStatus status,
            @Param("userId") Long userId
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
