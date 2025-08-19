package com.menufy.auth_service.dto;


import com.menufy.auth_service.models.Company;

public class UserCompanyDto {
    public String id;
    public String name;

    public UserCompanyDto(){}

    public UserCompanyDto(Company _company){
        this.id = _company.getId();
        this.name = _company.getCompanyName();
    }
}
