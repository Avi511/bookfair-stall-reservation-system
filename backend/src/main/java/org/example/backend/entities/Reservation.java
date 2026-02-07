package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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

    @Column(name = "reservation_date", nullable = false)
    private LocalDateTime reservationDate;

    @Column(name = "qr_code_path")
    private String qrToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "reservation_stalls",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "stall_id")
    )

    @Builder.Default
    private Set<Stall> stalls = new HashSet<>();
    public void addStall(Stall stall) {stalls.add(stall);}
    public void removeStall(Stall stall){ stalls.remove(stall); }

    @ManyToMany
    @JoinTable(
            name = "reservation_genres",
            joinColumns = @JoinColumn(name = "reservation_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    @Builder.Default
    private Set<Genre> genres  = new HashSet<>();
    public void addGenre(Genre genre){ genres.add(genre); }
    public void removeGenre(Genre genre){ genres.remove(genre); }

    @PrePersist
    protected void onCreate() {
        this.reservationDate = LocalDateTime.now();
        if(this.status == null) this.status = ReservationStatus.CONFIRMED;
    }
}
