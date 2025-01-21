package com.menufy.menu_service.repository;

import com.menufy.menu_service.models.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, String> {
    Language findByCode(String code);
}
