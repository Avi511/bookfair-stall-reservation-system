package org.example.backend.controllers;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.config.JwtConfig;
import org.example.backend.dtos.JwtResponse;
import org.example.backend.dtos.LoginRequest;
import org.example.backend.dtos.UserDto;
import org.example.backend.services.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtConfig jwtConfig;


    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
           var tokens = authService.login(request);

           var cookie = new Cookie("refreshToken", tokens.getRefreshToken());
           cookie.setHttpOnly(true);
           cookie.setPath("/");
           cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration()); //7days
           cookie.setSecure(true);
           response.addCookie(cookie);

           return ResponseEntity.ok(new JwtResponse(tokens.getAccessToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(
            @CookieValue(value = "refreshToken") String refreshToken
    ) {
        var accessToken = authService.refresh(refreshToken);

        return ResponseEntity.ok(new JwtResponse(accessToken));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        var userDto = authService.getCurrentUser();
        return ResponseEntity.ok(userDto);
    }

}
