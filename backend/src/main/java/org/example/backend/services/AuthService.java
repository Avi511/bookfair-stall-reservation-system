package org.example.backend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.*;
import org.example.backend.entities.OtpPurpose;
import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.mappers.UserMapper;
import org.example.backend.repositories.UserRepository;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    private final OtpService otpService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public AuthTokens login(LoginRequest request) {
        var normalizedEmail = normalizeEmail(request.getEmail());
        var user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(UserNotFoundException::new);

        if(!user.isEmailVerified()) {
            throw new UnauthorizedException("Invalid email or password.");
        }
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        normalizedEmail,
                        request.getPassword()
                )
        );

        var accessToken = jwtService.generateAccessToken(user).toString();
        var refreshToken = jwtService.generateRefreshToken(user).toString();
        return new AuthTokens(accessToken, refreshToken);
    }


    public String refresh(String refreshToken) {
        var jwt = jwtService.parseToken(refreshToken);
        if(jwt == null || jwt.isExpired())
            throw new UnauthorizedException("Invalid or expired refresh token");

        var user = userRepository.findById(jwt.getUserId())
                .orElseThrow(UserNotFoundException::new);
        return jwtService.generateAccessToken(user).toString();
    }

    public String forgotPassword(EmailRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        String masked = maskEmail(normalizedEmail);

        userRepository.findByEmail(normalizedEmail).ifPresent(user -> {
            if (!user.isEmailVerified()) return;
            String otp = otpService.createOtp(normalizedEmail, OtpPurpose.RESET_PASSWORD);
            emailService.sendOtpEmail(normalizedEmail, OtpPurpose.RESET_PASSWORD, otp);
        });

        return masked;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        var normalizedEmail = normalizeEmail(request.getEmail());
        var user = userRepository.findByEmail(normalizedEmail).orElseThrow(UserNotFoundException::new);

        var emailOtp =   otpService.validate(normalizedEmail, request.getOtp(), OtpPurpose.RESET_PASSWORD);
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpService.consume(emailOtp);
    }


    public UserDto getCurrentUser() {
        var user =  userRepository.findById(getCurrentUserId()).orElseThrow(UserNotFoundException::new);
        return userMapper.toUserDto(user);
    }


    public Long getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Authentication required.");
        }

        var principal = authentication.getPrincipal();
        if (principal instanceof Long userId) {
            return userId;
        }

        throw new UnauthorizedException("Invalid authentication principal.");
    }


    private String maskEmail(String email) {
        if (email == null || !email.contains("@")) return "your email";

        String[] parts = email.split("@");
        String local = parts[0];
        String domain = parts[1];

        if (local.length() <= 2) {
            return local.charAt(0) + "*****@" + domain;
        }

        String start = local.substring(0, 3);
        String end = local.substring(local.length() - 1);

        return start + "*****" + end + "@" + domain;
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new IllegalArgumentException("Email is required.");
        }
        String normalized = email.trim().toLowerCase();
        if (normalized.isBlank()) {
            throw new IllegalArgumentException("Email is required.");
        }
        return normalized;
    }

}
