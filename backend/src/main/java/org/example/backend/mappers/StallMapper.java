package org.example.backend.mappers;

import org.example.backend.dtos.AddStallRequest;
import org.example.backend.dtos.StallAvailabilityDto;
import org.example.backend.dtos.StallDto;
import org.example.backend.entities.Stall;
import org.mapstruct.BeanMapping;
import org.mapstruct.Builder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StallMapper {
    StallDto toDto(Stall stall);

    @BeanMapping(builder = @Builder(disableBuilder = true))
    Stall toEntity(AddStallRequest request);

    @Mapping(target = "reserved", ignore = true)
    StallAvailabilityDto toAvailabilityDto(Stall stall);

    void update(AddStallRequest request, @MappingTarget Stall stall);

    default StallAvailabilityDto toAvailabilityDto(Stall stall, boolean reserved) {
        StallAvailabilityDto dto = toAvailabilityDto(stall);
        dto.setReserved(reserved);
        return dto;
    }
}
