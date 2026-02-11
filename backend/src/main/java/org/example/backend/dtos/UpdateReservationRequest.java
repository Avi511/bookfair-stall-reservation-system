package org.example.backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class UpdateReservationRequest {
    @NotEmpty
    private List<Long> stallIds;
}
