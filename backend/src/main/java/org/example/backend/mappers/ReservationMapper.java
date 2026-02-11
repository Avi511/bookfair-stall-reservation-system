package org.example.backend.mappers;

import org.example.backend.dtos.ReservationDto;
import org.example.backend.entities.Reservation;
import org.example.backend.entities.ReservationStall;
import org.example.backend.entities.ReservationStatus;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ReservationMapper {

    @Autowired
    protected StallMapper stallMapper;
    @Autowired
    protected GenreMapper genreMapper;

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(target = "stalls", ignore = true)
    @Mapping(target = "genres", ignore = true)
    public abstract ReservationDto toDto(Reservation reservation);

    @AfterMapping
    protected void mapStalls(Reservation reservation, @MappingTarget ReservationDto dto) {
        boolean includeInactive = reservation.getStatus() == ReservationStatus.CANCELLED;
        dto.setStalls(
                reservation.getReservationStalls().stream()
                        .filter(rs -> includeInactive || rs.isActive())
                        .map(rs -> stallMapper.toDto(rs.getStall()))
                        .toList()
        );
        dto.setGenres(
                reservation.getGenres().stream()
                        .map(genreMapper::toDto)
                        .toList()
        );
    }
}
