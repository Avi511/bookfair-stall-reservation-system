package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.AuthTokens;
import org.example.backend.dtos.LoginRequest;
import org.example.backend.dtos.UserDto;
import org.example.backend.exceptions.UnauthorizedException;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.mappers.UserMapper;
import org.example.backend.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthTokens login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(UserNotFoundException::new);
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

    public UserDto getCurrentUser() {
        var user =  userRepository.findById(getCurrentUserId()).orElseThrow(UserNotFoundException::new);
        return userMapper.toUserDto(user);
    }

    public Long getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return (Long) authentication.getPrincipal();
    }
}
