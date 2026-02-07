package org.example.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GenreDto {
    private Long id;
    @NotBlank
    private String name;
}
