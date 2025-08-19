package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.BaseClaims;
import com.menufy.menu_service.dto.CompanyDto;
import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.models.Company;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {
    private final CompanyRepository companyRepository;

    public Company findCompany(String _companyId){
        Optional<Company> company = companyRepository.findById(_companyId);
        if(company.isPresent()){
            return company.get();
        }
        throw new RuntimeException("Company with given ID wasn't found");
    }

    public List<Item> addItemToCompanyItemList(Company company, Item _item) {
        company.addItemToItemList(_item);
        companyRepository.save(company);
        return company.getItems();
    }

    public List<Item> deleteItemFromCompanyItemList(Item item) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Company company = this.findCompany(claims.getCompanyId());
        company.removeItemFromCompanyItemList(item);
        return companyRepository.save(company).getItems();
    }

    public List<Category> addCategoryToCompanyCategoryList(Company company, Category category) {
        company.addCategoryToCategoryList(category);
        companyRepository.save(company);
        return company.getCategories();
    }

    public Item findItemById(String itemId, String companyId) {
        return  this.findCompany(companyId).findItemFromItemList(itemId);
    }

    public Category findCategoryById(String categoryId, String companyId) {
        Optional<Company> company = companyRepository.findById(companyId);
        if(company.isPresent()){
            return company.get().findCategoryFromCategoryList(categoryId);
        }
        throw new IllegalArgumentException();
    }

    public void saveEntity(Company company) {
        companyRepository.save(company);
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
