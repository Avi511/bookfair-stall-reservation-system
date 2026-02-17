package org.example.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import org.example.backend.entities.Size;

@Data
public class AddStallRequest {
    @NotBlank(message = "Stall code is required.")
    private String stallCode;

    @NotNull(message = "Size is required.")
    private Size size;

    @NotNull(message = "X position is required.")
    @PositiveOrZero(message = "X position must be zero or greater.")
    private Integer xPosition;

    @NotNull(message = "Y position is required.")
    @PositiveOrZero(message = "Y position must be zero or greater.")
    private Integer yPosition;
}
