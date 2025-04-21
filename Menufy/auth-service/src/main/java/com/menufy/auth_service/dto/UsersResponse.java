package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.User;

import java.util.List;

public record UsersResponse (List<User> users) {
}
