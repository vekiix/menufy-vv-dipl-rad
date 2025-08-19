package com.menufy.auth_service.dto;

import jakarta.annotation.Nullable;

public record TableRequest(@Nullable String uid, String tableName) {
}
