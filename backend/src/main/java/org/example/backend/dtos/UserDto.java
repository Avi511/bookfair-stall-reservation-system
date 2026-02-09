package org.example.backend.dtos;

import lombok.Data;
import org.example.backend.entities.Role;

@Data
public class UserDto {
    private Long id;
    private String businessName;
    private String email;
    private Role role;

}
