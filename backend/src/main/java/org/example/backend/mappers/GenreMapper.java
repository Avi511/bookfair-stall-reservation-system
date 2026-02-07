package org.example.backend.mappers;

import org.example.backend.dtos.CreateGenreRequest;
import org.example.backend.dtos.GenreDto;
import org.example.backend.entities.Genre;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    Genre toEntity(CreateGenreRequest request);

    GenreDto toDto(Genre genre);
}
