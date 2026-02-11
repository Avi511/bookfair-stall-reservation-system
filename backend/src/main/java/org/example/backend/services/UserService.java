package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.*;
import org.example.backend.entities.Role;
import org.example.backend.entities.User;
import org.example.backend.exceptions.UserNotFoundException;
import org.example.backend.mappers.UserMapper;
import org.example.backend.repositories.UserRepository;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class UserService  {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final AuthService authService;

    public UserDto registerBusinessUser(RegisterUserRequest request) {
        var user = createUserObject(request.getBusinessName(),  request.getEmail(), request.getPassword());
        user.setRole(Role.USER);
        userRepository.save(user);

        return userMapper.toUserDto(user);
    }

    public EmployeeDto registerEmployeeUser(RegisterEmployeeRequest request) {
        var user = createUserObject(null,  request.getEmail(), request.getPassword());
        user.setRole(Role.EMPLOYEE);
        userRepository.save(user);

        return userMapper.toEmployeeDto(user);
    }

    public User createUserObject(String businessName, String email, String password) {
        if(userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        return User.builder()
                .businessName(businessName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .build();
    }

    public UserDto updateUser(UpdateUserRequest request) {
        var user = userRepository.findById(authService.getCurrentUserId()).orElseThrow(UserNotFoundException::new);

        userMapper.update(request, user);
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

}
