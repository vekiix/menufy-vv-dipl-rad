package com.menufy.auth_service.dto;

public record UserRequest(String username, String companyId, int roleId) {
}
