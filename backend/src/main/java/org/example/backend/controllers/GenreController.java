package org.example.backend.controllers;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.CreateGenreRequest;
import org.example.backend.dtos.GenreDto;
import org.example.backend.entities.Genre;
import org.example.backend.mappers.GenreMapper;
import org.example.backend.repositories.GenreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreRepository genreRepository;
    private final GenreMapper genreMapper;

    @GetMapping
    public List<GenreDto> getAllGenres() {
        List<Genre> genres = genreRepository.findAll();
        return genres.stream().map(genreMapper::toDto).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGenre(
            @PathVariable int id
    ) {
        var genre = genreRepository.findById(id).orElse(null);
        if(genre == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok().body(genreMapper.toDto(genre));
    }

    @PostMapping
    public ResponseEntity<?> addGenre(
            @Valid @RequestBody CreateGenreRequest request,
            UriComponentsBuilder uriBuilder
            ) {
        if (genreRepository.existsByNameIgnoreCase(request.getName())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Genre already exists")
            );
        }

        var genre = genreRepository.save(genreMapper.toEntity(request));
        var dto = genreMapper.toDto(genre);

        var uri = uriBuilder.path("/api/genres/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGenre(
            @PathVariable int id
    ) {
        var genre = genreRepository.findById(id).orElse(null);
        if(genre == null)
            return ResponseEntity.notFound().build();
        genreRepository.delete(genre);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGenre(
            @PathVariable int id,
            @Valid @RequestBody CreateGenreRequest request
    ) {
        if (genreRepository.existsByNameIgnoreCase(request.getName())) {
            return ResponseEntity.badRequest().body(
                    Map.of("message", "Genre already exists")
            );
        }

        var genre = genreRepository.findById(id).orElse(null);
        if(genre == null)
            return ResponseEntity.notFound().build();

        genre.setName(request.getName());
        genreRepository.save(genre);
        return ResponseEntity.ok().body(genreMapper.toDto(genre));
    }

}
