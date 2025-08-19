package com.menufy.payment_service.dto;


import com.menufy.payment_service.models.Company;

public class CompanyDto {
    public String id;
    public String name;
    public String oib;

    public CompanyDto(){}

    public CompanyDto(Company _company){
        this.id = _company.getId();
        this.name = _company.getName();
        this.oib = _company.getOib();
    }
}
