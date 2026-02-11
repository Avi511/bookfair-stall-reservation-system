package org.example.backend.repositories;

import org.example.backend.entities.ReservationStall;
import org.example.backend.entities.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationStallRepository extends JpaRepository<ReservationStall, Long> {
    @Query("""
        select (count(rs) > 0)
        from ReservationStall rs
        join rs.reservation r
        where rs.event.id = :eventId
          and rs.stall.id in :stallIds
          and rs.active = true
    """)
    boolean anyActiveReservedInEvent(
            @Param("eventId") Integer eventId,
            @Param("stallIds") List<Long> stallIds
    );

    @Query("""
        select rs.stall.id
        from ReservationStall rs
        where rs.event.id = :eventId
          and rs.active = true
    """)
    List<Long> findActiveReservedStallIdsByEvent(@Param("eventId") Integer eventId);

    @Query("""
        select rs.stall.id
        from ReservationStall rs
        join rs.reservation r
        where rs.event.id = :eventId
          and r.user.id = :userId
          and r.status = :status
    """)
    List<Long> findMyReservedStallIdsInEvent(
            @Param("eventId") Integer eventId,
            @Param("userId") Long userId,
            @Param("status") ReservationStatus status
    );

    @Modifying
    @Query("""
        update ReservationStall rs
        set rs.active = false
        where rs.reservation.id = :reservationId
            and rs.active = true
    """)
    void deactivateByReservationId(Long reservationId);

    @Modifying
    @Query("""
        update ReservationStall rs
        set rs.active = false
        where rs.reservation.id = :reservationId
          and rs.stall.id in :stallIds
          and rs.active = true
    """)
    void deactivateReservationStalls(Long reservationId, List<Long> stallIds);

    @Modifying
    @Query("""
        delete from ReservationStall rs
        where rs.reservation.id = :reservationId
          and rs.stall.id in :stallIds
    """)
    void deleteReservationStalls(Long reservationId, List<Long> stallIds);

    @Query("""
        select rs.stall.id
        from ReservationStall rs
        where rs.reservation.id = :reservationId
          and rs.active = true
    """)
    List<Long> findActiveStallIds(Long reservationId);

}
