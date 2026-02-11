package org.example.backend.dtos;

import lombok.Data;
import org.example.backend.entities.Role;

@Data
public class EmployeeDto {
    private Long id;
    private String email;
    private Role role;
}
