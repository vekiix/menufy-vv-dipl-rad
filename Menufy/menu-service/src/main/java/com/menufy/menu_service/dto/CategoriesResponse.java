package com.menufy.menu_service.dto;

import com.menufy.menu_service.models.Category;

import java.util.List;

public record CategoriesResponse(List<Category> categories){}
