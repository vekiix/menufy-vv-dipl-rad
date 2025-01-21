package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.LoginRequest;
import com.menufy.auth_service.models.User;
import com.menufy.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;

    public User findUserWithCredentials(LoginRequest loginRequest)
    {
        return userRepository.findByUsernameAndPassword(loginRequest.getUsername(),loginRequest.getPassword());
    }

    public Optional<User> findUserById(String _id){
        return userRepository.findById(_id);
    }
}
