package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.User;

public class UserClaims {
    public String userId;
    public String companyId;
    public int roleId;

    public UserClaims (User user)
    {
        userId = user.getId();
        companyId = user.getCompany().getId();
        roleId = user.getRole().getId();
    }
}
