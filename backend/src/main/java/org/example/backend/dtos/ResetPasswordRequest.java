package org.example.backend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.example.backend.validations.Lowercase;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Email is required.")
    @Email(message = "Email must be valid.")
    @Lowercase(message = "Email must be lowercase.")
    private String email;

    @NotBlank(message = "Otp is required.")
    @Pattern(regexp = "\\d{6}", message = "Otp must be exactly 6 digits.")
    private String otp;

    @NotBlank(message = "New password is required.")
    @Size(min = 6, max = 25, message = "New password must be between 6 to 25 characters long.")
    private String newPassword;
}
