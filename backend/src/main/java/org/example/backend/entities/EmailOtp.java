package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_otps")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EmailOtp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "purpose")
    private OtpPurpose purpose;

    @Column(name = "email")
    private String email;

    @Column(name = "otp_hash")
    private String otpHash;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "attempts")
    private int attempts;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}
