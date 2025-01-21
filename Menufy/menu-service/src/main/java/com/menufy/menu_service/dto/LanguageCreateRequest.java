package com.menufy.menu_service.dto;

import com.menufy.menu_service.models.Language;

public record LanguageCreateRequest(String code, String fullName, String nativeName) {
}
