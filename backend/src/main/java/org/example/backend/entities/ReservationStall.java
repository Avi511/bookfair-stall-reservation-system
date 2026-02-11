package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reservation_stalls")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReservationStall {

    public ReservationStall(Reservation reservation, Stall stall, Event event, boolean active) {
        this.reservation = reservation;
        this.stall = stall;
        this.event = event;
        this.active = active;
    }

    @EmbeddedId
    private ReservationStallId id = new ReservationStallId();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @MapsId("reservationId")
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @MapsId("stallId")
    @JoinColumn(name = "stall_id", nullable = false)
    private Stall stall;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "active", nullable = false)
    private boolean active;
}
