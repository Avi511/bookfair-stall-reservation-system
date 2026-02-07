package org.example.backend.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class MakeReservationRequest {
    @NotBlank(message = "user id is required.")
    private Long userId;

    private Set<Long> stallIds;
}
