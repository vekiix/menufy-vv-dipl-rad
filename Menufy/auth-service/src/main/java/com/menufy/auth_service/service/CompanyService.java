package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.CompanyRequest;
import com.menufy.auth_service.exceptions.CompanyOibTakenException;
import com.menufy.auth_service.exceptions.MissingCompanyException;
import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    public Company getCompanyById(String s) {
        Optional<Company> companyOpt = companyRepository.findById(s);
        if(companyOpt.isPresent()){
            return companyOpt.get();
        }
        throw new MissingCompanyException();
    }

    public Company createCompany(CompanyRequest companyRequest) {
        if(companyRepository.findByOib(companyRequest.oib()).isPresent()){
            throw new CompanyOibTakenException();
        }

        Company company = new Company();
        company.setCompanyName(companyRequest.companyName());
        company.setOib(companyRequest.oib());
        company.setEncryptionKey(companyRequest.encryptionKey());
        company.setLogo(companyRequest.logo());

        return companyRepository.save(company);
    }

    public Company updateCompany(String companyId,CompanyRequest companyRequest) {

        Company company = this.getCompanyById(companyId);
        company.setCompanyName(companyRequest.companyName());
        company.setOib(companyRequest.oib());
        company.setUpdatedAt(LocalDateTime.now());
        company.setEncryptionKey(companyRequest.encryptionKey());
        company.setLogo(companyRequest.logo());

        return companyRepository.save(company);
    }

    public List<Company> deleteCompany(String companyId) {
        Company company = getCompanyById(companyId);
        companyRepository.delete(company);
        return getAllCompanies();
    }
}
