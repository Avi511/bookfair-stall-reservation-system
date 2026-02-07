package org.example.backend.repositories;

import jakarta.validation.constraints.NotBlank;
import org.example.backend.entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Integer> {
    boolean existsByNameIgnoreCase(@NotBlank String name);
}