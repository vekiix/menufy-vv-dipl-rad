package com.menufy.menu_service.controller;

import com.menufy.menu_service.dto.MenuResponse;
import com.menufy.menu_service.services.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/menu")
@RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;

    @GetMapping
    public ResponseEntity<MenuResponse> getMenuForCompany() {
        return ResponseEntity.ok(new MenuResponse(menuService.getCompanyMenu()));
    }

    @GetMapping("/add")
    public ResponseEntity<MenuResponse> addCategoryToMenu(@RequestParam String category) {
        return new ResponseEntity<>(new MenuResponse(menuService.addCategoryToMenu(category)), HttpStatus.CREATED);
    }

    @GetMapping("/remove")
    public ResponseEntity<MenuResponse> removeCategoryFromMenu(@RequestParam String category) {
        return new ResponseEntity<>(new MenuResponse(menuService.removeCategoryFromMenu(category)), HttpStatus.CREATED);
    }
}
