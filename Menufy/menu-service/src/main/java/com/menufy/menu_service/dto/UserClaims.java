package com.menufy.menu_service.dto;

public class UserClaims extends BaseClaims{
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

    // Getters and Setters (optional, but recommended for accessing and modifying fields)
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCompanyId() {
        return companyId;
    }

    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getRoleId() {
        return roleId;
    }

    @Override
    public String getIdentification() {
        return userId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }


}
