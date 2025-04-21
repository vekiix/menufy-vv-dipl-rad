package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.Company;

public class CompanyDto {
    public String id;
    public String name;
    public String oib;

    public CompanyDto(Company _company){
        this.id = _company.getId();
        this.name = _company.getCompanyName();
        this.oib = _company.getOib();
    }
}
