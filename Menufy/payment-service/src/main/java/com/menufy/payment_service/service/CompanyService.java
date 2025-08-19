package com.menufy.payment_service.service;
import com.menufy.payment_service.dto.BaseClaims;
import com.menufy.payment_service.dto.CompanyDto;
import com.menufy.payment_service.dto.KeksPayParamsRequest;
import com.menufy.payment_service.dto.WSPayParamsRequest;
import com.menufy.payment_service.models.Company;
import com.menufy.payment_service.models.KeksPayParameters;
import com.menufy.payment_service.models.WSPayParameters;
import com.menufy.payment_service.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {
    public final CompanyRepository companyRepository;

    private Company findCompany(String _companyId){
        Optional<Company> company = companyRepository.findById(_companyId);
        if(company.isPresent()){
            return company.get();
        }
        throw new RuntimeException("Company with given ID wasn't found");
    }


    public void createOrUpdateCompanyInfo(CompanyDto dto) {
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

    public Company updateCompanyKeksPayParameters(KeksPayParamsRequest req) {
        KeksPayParameters kpParameters = new KeksPayParameters(req.qr_type(), req.cid(), req.tid());
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Company company = this.findCompany(claims.getCompanyId());
        company.setKeksPayParameters(kpParameters);
        return companyRepository.save(company);
    }

    public Company updateCompanyWSPayParameters(WSPayParamsRequest req) {
        WSPayParameters wsParameters = new WSPayParameters(req.shopId(), req.version());
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Company company = this.findCompany(claims.getCompanyId());
        company.setWsPayParameters(wsParameters);
        return companyRepository.save(company);
    }

    public Company getCompanyInfo() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return this.findCompany(claims.getCompanyId());
    }

    public Company validateKeksPayParams() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Company company = this.findCompany(claims.getCompanyId());

        company.validateKeksPayParameters();
        return companyRepository.save(company);
    }

    public Company validateWSPayParams() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Company company = this.findCompany(claims.getCompanyId());

        company.validateWSPayParameters();
        return companyRepository.save(company);
    }
}
