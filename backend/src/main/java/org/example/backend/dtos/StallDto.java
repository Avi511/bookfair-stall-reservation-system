package org.example.backend.dtos;

import lombok.Data;
import org.example.backend.entities.Size;

@Data
public class StallDto {
    private Long id;
    private String stallCode;
    private Size size;
    private int xPosition;
    private int yPosition;
}
