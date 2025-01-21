package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.LanguageResponse;
import com.menufy.menu_service.dto.MenuCreateRequest;
import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.models.Language;
import com.menufy.menu_service.models.Menu;
import com.menufy.menu_service.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MenuService {
    private final MenuRepository menuRepository;
    private final LanguageService languageService;
    private final CurrencyService currencyService;

    public Menu addMenu(MenuCreateRequest menuCreateRequest) throws Exception
    {
        Menu menu = Menu.builder().build();

        menuRepository.save(menu);
        return menu;
    }
}
