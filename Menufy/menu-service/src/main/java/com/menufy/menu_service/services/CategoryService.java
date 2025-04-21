package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.BaseClaims;
import com.menufy.menu_service.dto.CategoryRequest;
import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.models.Company;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CompanyService companyService;
    private final CategoryRepository categoryRepository;


    public List<Category> addCategory(CategoryRequest categoryRequest) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Company company = companyService.findCompany(claims.getCompanyId());

        Category category = Category.builder()
                .name(categoryRequest.name())
                .image(categoryRequest.image())
                .build();

        categoryRepository.save(category);
        return companyService.addCategoryToCompanyCategoryList(company,category);
    }

    public List<Category> findAllCategories() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return companyService.findCompany(claims.getCompanyId()).getCategories();
    }

    public Category addItemToCategory(String itemId, String categoryId) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Item item = companyService.findItemById(itemId, claims.getCompanyId());
        Category category = companyService.findCategoryById(categoryId,claims.getCompanyId());
        category.addItemToCategory(item);

        return categoryRepository.save(category);
    }

    public Category removeItemFromCategory(String itemId, String categoryId) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Item item = companyService.findItemById(itemId, claims.getCompanyId());
        Category category = companyService.findCategoryById(categoryId,claims.getCompanyId());
        category.removeItemFromCategory(item);

        return categoryRepository.save(category);
    }

    public List<Category> deleteCategory(String id) {
        categoryRepository.deleteById(id);
        return findAllCategories();
    }

    public Category updateCategory(String categoryId, CategoryRequest categoryRequest) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Category category = companyService.findCategoryById(categoryId, claims.getCompanyId());
        category.setName(categoryRequest.name());
        category.setImage(categoryRequest.image());

        return categoryRepository.save(category);
    }
}
