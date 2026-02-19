package org.example.backend.controllers;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.*;
import org.example.backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;


    @PostMapping
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody RegisterUserRequest request,
            UriComponentsBuilder uriBuilder
    ) {

        var userDto = userService.verifyOtpAndCreateUser(request);
        var uri =  uriBuilder.path("/users/{id}").buildAndExpand(userDto.getId()).toUri();
        return ResponseEntity.created(uri).body(userDto);
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestRegisterOtp(
            @Valid @RequestBody EmailRequest request
    ) {
        var masked = userService.requestRegistrationOtp(request);
        return ResponseEntity.ok(
                Map.of("message", "OTP sent to " + masked)
        );
    }


    @PutMapping
    public ResponseEntity<UserDto> updateUser(
            @Valid @RequestBody UpdateUserRequest request
    ) {
        var userDto = userService.updateUser(request);
        return ResponseEntity.ok(userDto);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        userService.changePassword(request);
        return ResponseEntity.noContent().build();
    }
}
