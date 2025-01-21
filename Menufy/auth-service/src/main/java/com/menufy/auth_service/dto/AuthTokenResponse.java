package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.User;
import com.menufy.auth_service.utils.Messages;

public class AuthTokenResponse {
    public final String tokenType = "Bearer";
    public UserDto user;
    public long expiresIn;
    public String accessToken;
    public String scope;

    public static AuthTokenResponse createAuthToken(User _user, String _token, long _expiresIn) {
        AuthTokenResponse authTokenResponse = new AuthTokenResponse();
        authTokenResponse.expiresIn = _expiresIn;
        authTokenResponse.scope = Messages.CREATE_JWT_SCOPE;
        authTokenResponse.accessToken = _token;
        authTokenResponse.user = new UserDto(_user);
        return authTokenResponse;
    }

    public static AuthTokenResponse createGuestAuthToken(String _token, long _expiresIn) {
        AuthTokenResponse authTokenResponse = new AuthTokenResponse();
        authTokenResponse.expiresIn = _expiresIn;
        authTokenResponse.scope = Messages.CREATE_JWT_SCOPE;
        authTokenResponse.accessToken = _token;
        return authTokenResponse;
    }
}
