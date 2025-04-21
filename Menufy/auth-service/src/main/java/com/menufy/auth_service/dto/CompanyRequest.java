package com.menufy.auth_service.dto;

public record CompanyRequest(String companyName, String oib, String encryptionKey, String logo) {
}
