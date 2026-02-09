package org.example.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class ReservationStallId implements Serializable {
    @Column(name = "reservation_id")
    private Long reservationId;

    @Column(name = "stall_id")
    private Long stallId;
}
