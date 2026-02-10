package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

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

    @Column(name = "qr_token", nullable = false)
    private UUID qrToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status;

    @ManyToOne(optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ReservationStall> reservationStalls = new ArrayList<>();

    public void addStall(Stall stall) {
        var link = new ReservationStall(this, stall, this.event,true);
        reservationStalls.add(link);
    }

    public void removeStall(Stall stall) {
        reservationStalls.removeIf(rs -> rs.getStall().getId().equals(stall.getId()));
    }

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
        if(this.qrToken == null) this.qrToken = UUID.randomUUID();
    }
}
