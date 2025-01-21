package com.menufy.menu_service.controller;

import com.menufy.menu_service.dto.LanguageCreateRequest;
import com.menufy.menu_service.dto.LanguageResponse;
import com.menufy.menu_service.dto.MenuCreateRequest;
import com.menufy.menu_service.models.Language;
import com.menufy.menu_service.services.LanguageService;
import com.menufy.menu_service.services.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {
    private final MenuService menuService;

    @PostMapping
    public ResponseEntity<Object> createMenu(@RequestBody MenuCreateRequest menuCreateRequest) {
        try {
            return new ResponseEntity<>(menuService.addMenu(menuCreateRequest), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }}
