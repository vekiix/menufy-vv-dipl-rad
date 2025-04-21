package com.menufy.auth_service.service;

import com.menufy.auth_service.exceptions.MissingRoleException;
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

    public int getUserRoleId(){
        return 1;
    }

    public int getAdminRoleId(){
        return 2;
    }

    public Role getRoleById(int guestRoleId) {
        Optional<Role> role = roleRepository.findById(String.valueOf(guestRoleId));
        if(role.isEmpty()){
            throw new MissingRoleException();
        }
        return role.get();
    }
}
