package org.example.backend.controllers;


import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.example.backend.config.JwtConfig;
import org.example.backend.dtos.JwtResponse;
import org.example.backend.dtos.LoginRequest;
import org.example.backend.dtos.UserDto;
import org.example.backend.mappers.UserMapper;
import org.example.backend.repositories.UserRepository;
import org.example.backend.services.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@AllArgsConstructor
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtConfig jwtConfig;
    private final UserRepository userRepository;
    private final UserMapper userMapper;


    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
           authenticationManager.authenticate(
                   new UsernamePasswordAuthenticationToken(
                           request.getEmail(),
                           request.getPassword()
                   )
           );

           var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
           var accessToken = jwtService.generateAccessToken(user);
           var refreshToken = jwtService.generateRefreshToken(user);

//           send refresh token as cookie to client
           var cookie = new Cookie("refreshToken", refreshToken.toString());
           cookie.setHttpOnly(true);
           cookie.setPath("/");
           cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration()); //7days
           cookie.setSecure(true);
           response.addCookie(cookie);

           return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }

    @GetMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(
            @CookieValue(value = "refreshToken") String refreshToken
    ) {
        var jwt = jwtService.parseToken(refreshToken);
        if (jwt == null || jwt.isExpired())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        var user = userRepository.findById(jwt.getUserId()).orElseThrow();
        var accessToken = jwtService.generateAccessToken(user);

        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var id = (Long) authentication.getPrincipal();

        var user = userRepository.findById(id).orElse(null);
        if(user == null)
            return ResponseEntity.notFound().build();

        var userDto = userMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
