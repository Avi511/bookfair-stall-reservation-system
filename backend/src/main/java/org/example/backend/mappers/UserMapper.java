package org.example.backend.mappers;

import org.example.backend.dtos.RegisterUserRequest;
import org.example.backend.dtos.UpdateUserRequest;
import org.example.backend.dtos.UserDto;
import org.example.backend.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring") //spring can create beans of this type at runtime.
public interface UserMapper {
    UserDto toDto(User user);

    User toEntity(RegisterUserRequest request);

    void update(UpdateUserRequest request, @MappingTarget User user);
}
