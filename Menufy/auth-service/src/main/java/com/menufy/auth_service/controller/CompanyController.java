package com.menufy.auth_service.controller;


import com.menufy.auth_service.dto.CompaniesResponse;
import com.menufy.auth_service.dto.CompanyResponse;
import com.menufy.auth_service.dto.CompanyRequest;
import com.menufy.auth_service.dto.DataAction;
import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.service.CompanyService;
import com.menufy.auth_service.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {
    private final KafkaProducerService kafkaProducerService;
    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<CompaniesResponse> getAllCompanies(){
        return ResponseEntity.ok(new CompaniesResponse(companyService.getAllCompanies()));
    }

    @GetMapping("/info")
    public ResponseEntity<CompaniesResponse> getCompanyInfo(){
        return ResponseEntity.ok(new CompaniesResponse(companyService.getAllCompanies()));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<CompanyResponse> createCompany(@RequestBody CompanyRequest companyRequest){
        Company createdCompany = companyService.createCompany(companyRequest);
        kafkaProducerService.sendCompanyChange(DataAction.CREATE, createdCompany);
        return ResponseEntity.ok(new CompanyResponse(createdCompany));
    }

    @PutMapping()
    public ResponseEntity<CompanyResponse> updateCompany(@RequestBody CompanyRequest companyRequest, @RequestParam String company){
        Company updatedCompany = companyService.updateCompany(company,companyRequest);
        kafkaProducerService.sendCompanyChange(DataAction.UPDATE, updatedCompany);
        return ResponseEntity.ok(new CompanyResponse(updatedCompany));
    }

    @DeleteMapping
    public ResponseEntity<CompaniesResponse> deleteCompany(@RequestParam String company){
        Company companyToDelete = companyService.getCompanyById(company);
        List<Company> companyList = companyService.deleteCompany(company);
        kafkaProducerService.sendCompanyChange(DataAction.DELETE, companyToDelete);
        return ResponseEntity.ok(new CompaniesResponse(companyList));
    }

}
