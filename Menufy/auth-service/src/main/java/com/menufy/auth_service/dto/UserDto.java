package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.models.Role;
import com.menufy.auth_service.models.User;

public class UserDto {
    public String id;
    public String username;
    public String company;
    public String role;

    public UserDto(User _user) {
        this.id = _user.getId();
        this.username = _user.getUsername();
        this.company = _user.getCompany().toString();
        this.role = _user.getRole().toString();
    }
}
