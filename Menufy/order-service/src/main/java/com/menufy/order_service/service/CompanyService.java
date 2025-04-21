package com.menufy.order_service.service;
import com.menufy.order_service.dto.CompanyDto;
import com.menufy.order_service.models.Company;
import com.menufy.order_service.repository.CompanyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class CompanyService {

    public final CompanyRepository companyRepository;

    private Company findCompany(String _companyId){
        Optional<Company> company = companyRepository.findById(_companyId);
        if(company.isPresent()){
            return company.get();
        }
        throw new RuntimeException("Company with given ID wasn't found");
    }

    public void createOrUpdate(CompanyDto dto) {
        Company company = companyRepository.findById(dto.id)
                        .orElseGet(Company::new);

        company.setId(dto.id);
        company.setName(dto.name);
        company.setOib(dto.oib);

        companyRepository.save(company);
    }

    public void deleteCompany(CompanyDto _company) {
        Company company = findCompany(_company.id);
        companyRepository.delete(company);
    }
}
