package org.example.backend.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class MakeReservationRequest {
    @NotNull
    private Integer eventId;

    @NotEmpty
    private List<Long> stallIds;

}
