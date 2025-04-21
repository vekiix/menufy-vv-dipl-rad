package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.Company;

import java.util.List;

public record CompaniesResponse(List<Company> companies) {
}
