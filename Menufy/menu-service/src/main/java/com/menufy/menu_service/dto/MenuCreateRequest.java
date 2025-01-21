package com.menufy.menu_service.dto;

import java.util.List;

public record MenuCreateRequest(String languageCode,
                                List<CategoryRequest> categories) {}
