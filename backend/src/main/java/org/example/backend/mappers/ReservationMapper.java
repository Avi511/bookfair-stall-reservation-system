package org.example.backend.mappers;

import org.example.backend.dtos.ReservationDto;
import org.example.backend.entities.Reservation;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class ReservationMapper {

    @Autowired
    protected StallMapper stallMapper;

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(target = "stalls", ignore = true)
    public abstract ReservationDto toDto(Reservation reservation);

    @AfterMapping
    protected void mapStalls(Reservation reservation, @MappingTarget ReservationDto dto) {
        dto.setStalls(
                reservation.getReservationStalls().stream()
                        .map(rs -> stallMapper.toDto(rs.getStall()))
                        .toList()
        );
    }
}
