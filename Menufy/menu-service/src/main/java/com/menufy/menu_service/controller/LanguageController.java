package com.menufy.menu_service.controller;

import com.menufy.menu_service.dto.*;
import com.menufy.menu_service.models.Language;
import com.menufy.menu_service.services.LanguageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/language")
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @PostMapping
    public ResponseEntity<Object> createLanguage(@RequestBody LanguageCreateRequest languageCreateRequest) {
        try {
            return new ResponseEntity<>(languageService.createLanguage(languageCreateRequest),HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e,HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.OK)
    public List<Language> getAll() {
        return languageService.getAllLanguages();
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public Language getByCode( @RequestParam String code) {
        return languageService.getLanguageByCode(code);
    }
}
