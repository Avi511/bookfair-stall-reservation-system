package org.example.backend.repositories;

import org.example.backend.entities.ReservationStall;
import org.example.backend.entities.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
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
          and r.status = :status
    """)
    boolean anyReservedInEvent(
            @Param("eventId") Long eventId,          // ✅ FIXED
            @Param("stallIds") List<Long> stallIds,
            @Param("status") ReservationStatus status
    );

    @Query("""
        select rs.stall.id
        from ReservationStall rs
        join rs.reservation r
        where rs.event.id = :eventId
          and r.user.id = :userId
          and r.status = :status
    """)
    List<Long> findMyReservedStallIdsInEvent(
            @Param("eventId") Long eventId,           // ✅ FIXED
            @Param("userId") Long userId,
            @Param("status") ReservationStatus status
    );
}
