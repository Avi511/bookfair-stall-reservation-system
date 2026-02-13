package org.example.backend.dtos;

import lombok.Data;
import org.example.backend.entities.ReservationStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class ReservationDto {
    private Long id;
    private Integer eventId;
    private Long userId;
    private ReservationStatus status;
    private LocalDateTime reservationDate;
    private UUID qrToken;
    private List<StallDto> stalls;
    private List<GenreDto> genres;
}
