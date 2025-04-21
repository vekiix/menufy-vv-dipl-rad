package com.menufy.menu_service.services;

import com.menufy.menu_service.exceptions.InvalidJWTException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.webauthn.authentication.WebAuthnAuthentication;
import org.springframework.stereotype.Service;

import java.util.Collections;


@Service
@RequiredArgsConstructor
public class AuthTokenService {
    private final JWTService jwtService;

    public Authentication validateToken(String _jwtToken) throws InvalidJWTException{
        if(jwtService.validateToken(_jwtToken)){
            if(jwtService.isUserToken(_jwtToken)){
                switch (jwtService.getRoleIdFromClaims(_jwtToken)){
                    case 1:
                        return new UsernamePasswordAuthenticationToken(jwtService.parseUserJWTToken(_jwtToken), null,
                                Collections.singletonList(new SimpleGrantedAuthority("USER")));
                    case 2:
                        return new UsernamePasswordAuthenticationToken(jwtService.parseUserJWTToken(_jwtToken), null,
                                Collections.singletonList(new SimpleGrantedAuthority("ADMIN")));
                }
            }
            else if(jwtService.isGuestToken(_jwtToken)){
                return new AnonymousAuthenticationToken(jwtService.getGuestCmacFromClaims(_jwtToken), jwtService.parseGuestJWTToken(_jwtToken),
                        Collections.singletonList(new SimpleGrantedAuthority("GUEST")));
            }
        }
        throw new InvalidJWTException();
    }

}
