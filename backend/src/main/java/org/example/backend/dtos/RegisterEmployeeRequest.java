package org.example.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.example.backend.validations.Lowercase;

@Data
public class RegisterEmployeeRequest {
    @NotBlank(message = "Email is required.")
    @Email(message = "Email must be valid.")
    @Lowercase(message = "Email must be lowercase.")
    private String email;

    @NotBlank(message = "Password is required.")
    @Size(min = 6, max = 25, message = "Password must be between 6 to 25 characters long.")
    private String password;
}
