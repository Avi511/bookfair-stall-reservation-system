package org.example.backend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.backend.entities.EmailOtp;
import org.example.backend.entities.OtpPurpose;
import org.example.backend.repositories.EmailOtpRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@Transactional
public class OtpService {

    private final EmailOtpRepository emailOtpRepository;
    private final PasswordEncoder passwordEncoder;

    public static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;

    private static final int RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_SENDS_IN_WINDOW = 3;
    private static final int SEND_WINDOW_MINUTES = 10;

    public String createOtp(String email, OtpPurpose purpose) {
        String normalizedEmail = normalizeEmail(email);

        var last = emailOtpRepository
                .findTopByEmailAndPurposeOrderByCreatedAtDesc(normalizedEmail, purpose)
                .orElse(null);

        if (last != null && last.getCreatedAt().isAfter(LocalDateTime.now().minusSeconds(RESEND_COOLDOWN_SECONDS))) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Please wait before requesting another OTP"
            );
        }

        long sentCount = emailOtpRepository.countSince(
                normalizedEmail,
                purpose,
                LocalDateTime.now().minusMinutes(SEND_WINDOW_MINUTES)
        );

        if (sentCount >= MAX_SENDS_IN_WINDOW) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many OTP requests. Please try again later."
            );
        }

        String otp = generate6DigitOtp();

        var emailOtp = EmailOtp.builder()
                .email(normalizedEmail)
                .purpose(purpose)
                .otpHash(passwordEncoder.encode(otp))
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .attempts(0)
                .createdAt(LocalDateTime.now())
                .build();

        emailOtpRepository.save(emailOtp);
        return otp;
    }


    public EmailOtp validate(String email, String otp, OtpPurpose purpose) {
        String normalizedEmail = normalizeEmail(email);
        String normalizedOtp = normalizeOtp(otp);

        var record =  emailOtpRepository
                .findTopByEmailAndPurposeOrderByCreatedAtDesc(normalizedEmail, purpose)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP."));

        if(record.getExpiresAt().isBefore(LocalDateTime.now())) {
            emailOtpRepository.delete(record);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP expired.");
        }

        if(record.getAttempts() >= MAX_ATTEMPTS) {
            throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many OTP attempts.");
        }

        if(!passwordEncoder.matches(normalizedOtp, record.getOtpHash())) {
            record.setAttempts(record.getAttempts() + 1);
            emailOtpRepository.save(record);

            if(record.getAttempts() >= MAX_ATTEMPTS) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS, "Too many OTP attempts.");
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid OTP.");
        }

        return record;
    }

    public void consume(EmailOtp emailOtp) {
        emailOtpRepository.delete(emailOtp);
    }

    private String generate6DigitOtp() {
        return String.valueOf(new SecureRandom().nextInt(900000) + 100000);
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        String normalized = email.trim().toLowerCase();
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        return normalized;
    }

    private String normalizeOtp(String otp) {
        if (otp == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Otp is required");
        }
        String normalized = otp.trim();
        if (normalized.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Otp is required");
        }
        return normalized;
    }
}
