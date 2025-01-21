package com.menufy.auth_service.service;

import com.menufy.auth_service.models.Role;
import com.menufy.auth_service.repository.RoleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public int getGuestRoleId(){
        return 0;
    }

    public Optional<Role> getRoleById(int guestRoleId) {
        return roleRepository.findById(String.valueOf(guestRoleId));
    }
}
