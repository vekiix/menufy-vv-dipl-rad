package com.menufy.order_service.dto;

public class UserClaims extends BaseClaims{
    private String username;
    private String companyId;
    private String userId;
    private int roleId;

    // Constructor
    public UserClaims(String username, String companyId, String userId, int roleId) {
        this.username = username;
        this.companyId = companyId;
        this.userId = userId;
        this.roleId = roleId;
    }
    @Override
    public String getCompanyId() {
        return companyId;
    }

    @Override
    public int getRoleId() {
        return roleId;
    }

    @Override
    public String getIdentification() {
        return userId;
    }

    @Override
    public String getTableId() {
        throw new RuntimeException("User does not have a Table ID");
    }

}
