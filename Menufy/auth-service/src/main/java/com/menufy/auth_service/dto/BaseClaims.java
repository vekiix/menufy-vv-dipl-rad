package com.menufy.auth_service.dto;

public abstract class BaseClaims {
    public abstract String getCompanyId();
    public abstract int getRoleId();
    public abstract String getIdentification();
}
