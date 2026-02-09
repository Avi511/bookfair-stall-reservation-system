package org.example.backend.dtos;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String businessName;
    private String email;
}
