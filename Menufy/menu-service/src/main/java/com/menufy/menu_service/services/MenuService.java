package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.BaseClaims;
import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.models.Company;
import com.menufy.menu_service.models.Menu;
import com.menufy.menu_service.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {
    private final MenuRepository menuRepository;
    private final CompanyService companyService;

    public Menu addCategoryToMenu(String _categoryId) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Company company = companyService.findCompany(claims.getCompanyId());

        Menu companyMenu = company.getMenu() == null ? new Menu() : company.getMenu();
        Category category = company.findCategoryFromCategoryList(_categoryId);

            companyMenu.addCategoryToMenu(category);
            menuRepository.save(companyMenu);
            company.setMenu(companyMenu);
            companyService.saveEntity(company);

            return companyMenu;
    }

    public Menu getCompanyMenu() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        System.out.println(claims.getCompanyId());

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
