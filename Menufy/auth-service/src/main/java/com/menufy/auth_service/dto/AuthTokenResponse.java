package com.menufy.auth_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.menufy.auth_service.models.Guest;
import com.menufy.auth_service.models.User;
import com.menufy.auth_service.utils.Messages;

import java.time.LocalDateTime;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class AuthTokenResponse {
    public final LocalDateTime createdAt = LocalDateTime.now();
    public final String tokenType = "Bearer";
    public UserDto user;
    public UserCompanyDto company;
    public GuestDto guest;
    public long expiresIn;
    public String accessToken;
    public String scope;

    public static AuthTokenResponse createAuthToken(User _user, String _token, long _expiresIn) {
        AuthTokenResponse authTokenResponse = new AuthTokenResponse();
        authTokenResponse.company = new UserCompanyDto(_user.getCompany());
        authTokenResponse.expiresIn = _expiresIn;
        authTokenResponse.scope = Messages.CREATE_JWT_SCOPE;
        authTokenResponse.accessToken = _token;
        authTokenResponse.user = new UserDto(_user);
        return authTokenResponse;
    }

    public static AuthTokenResponse createGuestAuthToken(Guest guest, String _token, long _expiresIn) {
        AuthTokenResponse authTokenResponse = new AuthTokenResponse();
        authTokenResponse.guest = new GuestDto(guest);
        authTokenResponse.company = new UserCompanyDto(guest.getTable().getCompany());
        authTokenResponse.expiresIn = _expiresIn;
        authTokenResponse.scope = Messages.CREATE_JWT_SCOPE;
        authTokenResponse.accessToken = _token;
        return authTokenResponse;
    }
}
