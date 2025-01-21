package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.*;
import com.menufy.menu_service.models.Language;
import com.menufy.menu_service.repository.LanguageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class LanguageService {
    private final LanguageRepository languageRepository;

    public Language createLanguage(LanguageCreateRequest languageRequest) throws Exception {
        Language language = Language.builder()
                .code(languageRequest.code())
                .fullName(languageRequest.fullName())
                .nativeName(languageRequest.nativeName())
                .build();

        languageRepository.save(language);
        return language;
    }

    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }

    public Language getLanguageByCode(String code)
    {
        return languageRepository.findByCode(code);
    }
}
