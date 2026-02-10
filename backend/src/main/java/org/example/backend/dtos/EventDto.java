package org.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.example.backend.entities.EventStatus;

import java.time.LocalDateTime;
import java.util.Date;

@Data
public class EventDto {
    private Integer id;
    private String name;
    private Integer year;
    private EventStatus status;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date startDate;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private Date endDate;
    private LocalDateTime createdAt;
}
