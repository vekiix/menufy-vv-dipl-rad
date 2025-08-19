package com.menufy.payment_service.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UserClaims extends BaseClaims{
    // Getters and Setters (optional, but recommended for accessing and modifying fields)
    private String username;
    private String companyId;
    private String userId;
    private int roleId;

    // Constructor
    public UserClaims(String username, String userId, String companyId, int roleId) {
        this.username = username;
        this.companyId = companyId;
        this.userId = userId;
        this.roleId = roleId;
    }

    @Override
    public String getIdentification() {
        return userId;
    }


}
