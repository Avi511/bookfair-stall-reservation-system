package org.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.example.backend.entities.EventStatus;

import java.util.Date;

@Data
public class CreateEventRequest {
    @NotBlank
    private String name;

    @NotNull
    @Positive
    private Integer year;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;

    @NotNull
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;

    private EventStatus status;
}
