package org.example.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank(message = "Name is required.")
    @Size(max = 255, message = "Name must be less than 255 characters.")
    private String businessName;
}
