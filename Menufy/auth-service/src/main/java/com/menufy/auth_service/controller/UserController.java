package com.menufy.auth_service.controller;


import com.menufy.auth_service.dto.*;
import com.menufy.auth_service.models.User;
import com.menufy.auth_service.service.KafkaProducerService;
import com.menufy.auth_service.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    public final UserService userService;
    public final KafkaProducerService kafkaProducerService;

    @GetMapping
    public ResponseEntity<UsersResponse> getAllUsers(){
        return ResponseEntity.ok(new UsersResponse(userService.getAllUsers()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> createNewUser(@Valid @RequestBody UserRequest userRequest){
        return ResponseEntity.ok(new UserResponse(userService.createUser(userRequest)));
    }

    @PutMapping()
    public ResponseEntity<UserResponse> updateUser(@RequestBody UserRequest userRequest, @RequestParam String user){
        return ResponseEntity.ok(new UserResponse(userService.updateUser(user,userRequest)));
    }

    @DeleteMapping
    public ResponseEntity<UsersResponse> deleteUser(@RequestParam String user){
        return ResponseEntity.ok(new UsersResponse(userService.deleteUser(user)));
    }

}
