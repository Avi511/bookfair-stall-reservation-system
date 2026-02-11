package org.example.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.example.backend.entities.Size;

@Data
public class AddStallRequest {
    @NotBlank(message = "Stall code is required.")
    private String stallCode;
    @NotBlank(message = "Size is required.")
    private Size size;
    @NotBlank(message = "X position is required.")
    private int xPosition;
    @NotBlank(message = "Y position is required.")
    private int yPosition;
}
