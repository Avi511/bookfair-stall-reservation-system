package org.example.backend.mappers;

import org.example.backend.dtos.StallDto;
import org.example.backend.entities.Stall;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StallMapper {
    StallDto toDto(Stall stall);
}
