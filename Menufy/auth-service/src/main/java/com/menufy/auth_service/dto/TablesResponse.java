package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.CompanyTable;

import java.util.List;

public record TablesResponse(List<CompanyTable> tables) {
}
