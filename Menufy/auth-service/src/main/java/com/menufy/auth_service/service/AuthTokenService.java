package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.AuthTokenResponse;
import com.menufy.auth_service.dto.LoginRequest;
import com.menufy.auth_service.exceptions.InvalidRequestParametersException;
import com.menufy.auth_service.exceptions.InvalidCredentialsException;
import com.menufy.auth_service.exceptions.InvalidJWTException;
import com.menufy.auth_service.models.*;
import com.menufy.auth_service.models.User;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthTokenService{

    private final JWTService jwtService;
    private final CryptographyService cryptographyService;

    private final UserService userService;
    private final TableService tableService;
    private final GuestService guestService;

    public Authentication createResponseForApplicationUser(LoginRequest loginRequest) {
        User user = userService.findUserWithCredentials(loginRequest);
        if(user == null) throw new InvalidCredentialsException();
        return new UsernamePasswordAuthenticationToken(AuthTokenResponse.createAuthToken(user,
                jwtService.generateTokenForUser(user), jwtService.getUserTokenLength()),
                null, user.getAuthorities());
    }

    public Authentication createResponseForNFCGuest(String uid, String counter, String cmac){
        CompanyTable tableRecord = tableService.findTableByUID(uid);
        int scanCount = cryptographyService.hexToInteger(counter);
        if(cryptographyService.validateCMACForNFCScan(uid,counter,cmac, tableRecord.getCompany().getEncryptionKey())) {
            Guest guest = guestService.createAndInsertGuest(tableRecord, cmac, scanCount);
            tableRecord.updateTableScanCount(scanCount);

            return new AnonymousAuthenticationToken(cmac, AuthTokenResponse.createGuestAuthToken(guest,
                    jwtService.generateTokenForGuest(guest),
                    jwtService.getGuestTokenLength()), guest.getAuthorities());
        }
        throw new InvalidRequestParametersException();
    }


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

    public Map<String, String> getNextGuestValidRequestURL() {
        Map<String,String> urls = new HashMap<>();

        tableService.getAllTables().forEach(t -> {
            String sb = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString() +  "/login" +
                    "?uid=" + t.getUid() +
                    "&ctr=" + cryptographyService.intToSixCharHexString(t.getScanCount() + 1) +
                    "&cmac=" + cryptographyService.generateCMACDataForSpecificScan(t.getUid(), t.getScanCount() + 1, t.getCompany().getEncryptionKey());

            urls.put(t.getCompany() + "-" + t.getUid().toString(), sb);
        });
        return urls;
    }
}
