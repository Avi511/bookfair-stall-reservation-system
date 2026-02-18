package org.example.backend.services;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.*;
import org.example.backend.entities.OtpPurpose;
import org.example.backend.entities.Role;
import org.example.backend.entities.User;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.mappers.UserMapper;
import org.example.backend.repositories.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@AllArgsConstructor
@Service
public class UserService  {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthService authService;
    private final OtpService otpService;
    private final EmailService emailService;

    @Transactional
    public String requestRegistrationOtp(EmailRequest request) {

        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        String otp = otpService.createOtp(normalizedEmail, OtpPurpose.VERIFY_EMAIL);
        emailService.sendOtpEmail(normalizedEmail, OtpPurpose.VERIFY_EMAIL, otp);

        return maskEmail(normalizedEmail);
    }

    @Transactional
    public UserDto verifyOtpAndCreateUser(RegisterUserRequest request) {

        String normalizedEmail = normalizeEmail(request.getEmail());

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        var emailOtp =  otpService.validate(
                normalizedEmail,
                request.getOtp(),
                OtpPurpose.VERIFY_EMAIL
        );

        User user = createUserObject(
                request.getBusinessName(),
                normalizedEmail,
                request.getPassword(),
                true
        );
        user.setRole(Role.USER);

        userRepository.save(user);
        otpService.consume(emailOtp);

        return userMapper.toUserDto(user);
    }

    public EmployeeDto registerEmployeeUser(RegisterEmployeeRequest request) {
        var user = createUserObject(null, normalizeEmail(request.getEmail()), request.getPassword(), true);
        user.setRole(Role.EMPLOYEE);
        userRepository.save(user);

        return userMapper.toEmployeeDto(user);
    }


    public User createUserObject(String businessName, String email, String password, boolean emailVerified) {
        var normalizedEmail = normalizeEmail(email);
        if(userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        return User.builder()
                .businessName(businessName)
                .email(normalizedEmail)
                .password(passwordEncoder.encode(password))
                .emailVerified(emailVerified)
                .build();
    }

    public UserDto updateUser(UpdateUserRequest request) {
        var user = userRepository.findById(authService.getCurrentUserId()).orElseThrow(UserNotFoundException::new);

        user.setBusinessName(request.getBusinessName().trim());
        userRepository.save(user);

        return  userMapper.toUserDto(user);
    }

    public void changePassword(ChangePasswordRequest request) {
        var user = userRepository.findById(authService.getCurrentUserId()).orElseThrow(UserNotFoundException::new);

        if(!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadCredentialsException("Password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
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

}
