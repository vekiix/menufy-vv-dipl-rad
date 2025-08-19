package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.BaseClaims;
import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.models.Company;
import com.menufy.menu_service.models.Menu;
import com.menufy.menu_service.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {
    private final MongoTemplate mongoTemplate;
    private final MenuRepository menuRepository;
    private final CompanyService companyService;

    public Menu addCategoryToMenu(String _categoryId) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Company company = companyService.findCompany(claims.getCompanyId());

        Category categoryToAdd = company.findCategoryFromCategoryList(_categoryId);

        Query query = new Query(Criteria.where("id").is(company.getMenu().getId()));
        Update update = new Update().addToSet("categories", categoryToAdd);

        mongoTemplate.updateFirst(query, update, Menu.class);

        return getCompanyMenu();
    }

    public Menu getCompanyMenu() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return companyService.findCompany(claims.getCompanyId()).getMenu();
    }

    public Menu removeCategoryFromMenu(String categoryId) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Company company = companyService.findCompany(claims.getCompanyId());
        Menu menu = company.getMenu();
        Category category = company.findCategoryFromCategoryList(categoryId);
        menu.removeCategoryFromMenu(category);

        return menuRepository.save(menu);
    }
}
