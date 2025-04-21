package com.menufy.menu_service.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.menufy.menu_service.models.Company;

public class CompanyChangeDto {
    public DataAction operation;
    public CompanyDto company;

    public CompanyChangeDto(DataAction _operation, Company _company){
        this.operation = _operation;
        this.company = new CompanyDto(_company);
    }

    public CompanyChangeDto(){}

    @Override
    public String toString()
    {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return ((ObjectWriter) ow).writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem while parsing 'CompanyChangeDto'");
        }
    }
}
