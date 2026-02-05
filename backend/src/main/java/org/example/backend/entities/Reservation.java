package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "reservation_date")
    private LocalDateTime reservationDate;

    @Column(name = "qr_code_path")
    private String qrCodePath;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany
    @JoinTable(
            name = "reservation_stalls",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "stall_id")
    )
    @Builder.Default
    private Set<Stall> stalls = new HashSet<>();
    public void addStall(Stall stall) {
        stalls.add(stall);
        stall.setIsReserved(true);
    }
}
