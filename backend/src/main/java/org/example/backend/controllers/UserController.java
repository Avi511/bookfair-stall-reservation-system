package org.example.backend.controllers;


import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.ChangePasswordRequest;
import org.example.backend.dtos.RegisterUserRequest;
import org.example.backend.dtos.UpdateUserRequest;
import org.example.backend.dtos.UserDto;
import org.example.backend.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

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
        var userDto = userService.registerBusinessUser(request);
        var uri = uriBuilder.path("/api/users/{id}").buildAndExpand(userDto.getId()).toUri();
        return ResponseEntity.created(uri).body(userDto);
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
