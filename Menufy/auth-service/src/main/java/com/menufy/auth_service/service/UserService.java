package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.UserRequest;
import com.menufy.auth_service.dto.LoginRequest;
import com.menufy.auth_service.exceptions.InvalidCredentialsException;
import com.menufy.auth_service.exceptions.MissingUserException;
import com.menufy.auth_service.exceptions.UsernameTakenException;
import com.menufy.auth_service.models.User;
import com.menufy.auth_service.repository.UserRepository;
import com.menufy.auth_service.utils.HelperUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {
    private final UserRepository userRepository;
    private final RoleService roleService;
    private final CompanyService companyService;

    public User findUserWithCredentials(LoginRequest loginRequest)
    {
        Optional<User> user = userRepository.findByUsernameAndPassword(loginRequest.getUsername(),loginRequest.getPassword());
        if(user.isPresent()){
            return user.get();
        }
        throw new InvalidCredentialsException();
    }

    public User findUserById(String _id){
        System.out.println(_id);
        Optional<User> user = userRepository.findById(_id);
        if(user.isPresent()){
            return user.get();
        }
        throw new MissingUserException();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(UserRequest userRequest) {
        if(userRepository.findByUsername(userRequest.username()).isPresent()){
            throw new UsernameTakenException();
        }
        User user = new User();
        user.setUsername(userRequest.username());
        user.setRole(roleService.getRoleById(userRequest.roleId()));
        user.setCompany(companyService.getCompanyById(userRequest.companyId()));
        user.setPassword(userRequest.password());
        return userRepository.save(user);
    }

    public User updateUser(String userId, UserRequest userRequest){
        User user = this.findUserById(userId);
        user.setUsername(userRequest.username());
        user.setCompany(companyService.getCompanyById(userRequest.companyId()));
        user.setPassword(userRequest.password());
        user.setRole(roleService.getRoleById(userRequest.roleId()));

        return userRepository.save(user);
    }

    public List<User> deleteUser(String userId) {
        User user = this.findUserById(userId);
        userRepository.delete(user);
        return this.getAllUsers();
    }
}
