package org.example.backend.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.backend.entities.EventStatus;

@Data
public class UpdateEventStatusRequest {
    @NotNull
    private EventStatus status;
}
