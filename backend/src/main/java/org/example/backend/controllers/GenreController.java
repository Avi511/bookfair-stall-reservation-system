package org.example.backend.controllers;


import org.example.backend.entities.Genre;
import org.example.backend.repositories.GenreRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreRepository genreRepository;

    public GenreController(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @PostMapping
    public void addGenre(
            @RequestBody Genre genre
    ) {
        genreRepository.save(genre);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGenre(
            @PathVariable int id
    ) {
        var genre = genreRepository.findById(id).orElse(null);
        if(genre == null)
            return ResponseEntity.noContent().build();
        genreRepository.delete(genre);
        return ResponseEntity.noContent().build();
    }

}
