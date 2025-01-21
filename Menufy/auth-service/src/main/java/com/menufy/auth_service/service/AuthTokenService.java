package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.AuthTokenResponse;
import com.menufy.auth_service.dto.LoginRequest;
import com.menufy.auth_service.exceptions.InvalidRequestParametersException;
import com.menufy.auth_service.exceptions.InvalidCredentialsException;
import com.menufy.auth_service.exceptions.InvalidJWTException;
import com.menufy.auth_service.exceptions.MissingRoleException;
import com.menufy.auth_service.models.Role;
import com.menufy.auth_service.models.Table;
import com.menufy.auth_service.models.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthTokenService{

    private final JWTService jwtService;
    private final CryptographyService cryptographyService;

    private final UserService userService;
    private final TableService tableService;
    private final RoleService roleService;

    public Authentication createResponseForApplicationUser(LoginRequest loginRequest) {
        User user = userService.findUserWithCredentials(loginRequest);
        if(user == null) throw new InvalidCredentialsException();
        return new UsernamePasswordAuthenticationToken(AuthTokenResponse.createAuthToken(user,
                jwtService.generateTokenForUser(user), jwtService.getUserTokenLength()),
                null,Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
    }

    public Authentication createResponseForNFCGuest(String uid, String counter, String cmac){
            Optional<Table> table = tableService.findTableByUID(uid);
            if(table.isPresent()){
                Optional<Role> role = roleService.getRoleById(roleService.getGuestRoleId());
                User user = new User();
                if(role.isPresent()){
                    user.setCompany(table.get().getCompany());
                    user.setRole(role.get());
                    user.setId(cmac);
                    user.setUsername("Guest-"+uid);
                }else {
                    throw new MissingRoleException();
                }
                if(cryptographyService.validateCMACForNFCScan(uid,counter,cmac, table.get().getCompany().getEncryptionKey())) {
                    return new AnonymousAuthenticationToken(uid, AuthTokenResponse.createAuthToken(user,
                            jwtService.generateTokenForGuest(cmac, table.get(), roleService.getGuestRoleId()),
                            jwtService.getGuestTokenLength()), Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST")));
                }
            }
            throw new InvalidRequestParametersException();
    }


    public Authentication validateToken(String _jwtToken) throws InvalidJWTException {
        if(jwtService.validateToken(_jwtToken)){
            if(jwtService.isUserToken(_jwtToken)){
                Optional<User> user = userService.findUserById(jwtService.getUserIdFromClaims(_jwtToken));
                if(user.isPresent()){
                    return new UsernamePasswordAuthenticationToken(user, null, user.get().getAuthorities());
                }
            }
            else if(jwtService.isGuestToken(_jwtToken)){
                Optional<Table> table = tableService.findTableByUID(jwtService.getTableIdFromClaims(_jwtToken));
                if(table.isPresent()){
                    return new AnonymousAuthenticationToken(jwtService.getGuestIdFromClaims(_jwtToken),table.get(),
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_GUEST")));
                }
            }
        }
        throw new InvalidJWTException();
    }

}
