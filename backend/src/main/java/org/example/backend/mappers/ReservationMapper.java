package org.example.backend.mappers;

import org.example.backend.dtos.ReservationDto;
import org.example.backend.entities.Reservation;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "event.id", target = "eventId")
    @Mapping(target = "stalls", ignore = true)
    ReservationDto toDto(Reservation reservation);


    @AfterMapping
    default void mapStalls(Reservation reservation,
                           @MappingTarget ReservationDto dto,
                           @Context StallMapper stallMapper) {

        List<org.example.backend.dtos.StallDto> stalls = reservation.getReservationStalls()
                .stream()
                .map(rs -> stallMapper.toDto(rs.getStall()))
                .toList();

        dto.setStalls(stalls);
    }
}
