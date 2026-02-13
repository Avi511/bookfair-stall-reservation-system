package org.example.backend.mappers;

import org.example.backend.dtos.*;
import org.example.backend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDto toUserDto(User user);
    EmployeeDto toEmployeeDto(User user);

    User toEntity(RegisterEmployeeRequest request);

    User toEntity(RegisterUserRequest request);

    void update(UpdateUserRequest request, @MappingTarget User user);
}
