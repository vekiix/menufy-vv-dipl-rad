package com.menufy.auth_service.controller;


import com.menufy.auth_service.dto.AuthTokenResponse;
import com.menufy.auth_service.service.AuthTokenService;
import com.menufy.auth_service.service.CryptographyService;
import com.menufy.auth_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.Globals;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class TokenController {

    private final UserService userService;
    private final AuthTokenService authTokenService;
    private final CryptographyService cryptographyService;

    @GetMapping()
    public ResponseEntity<AuthTokenResponse> authenticateUserFromNFCScan(@AuthenticationPrincipal AuthTokenResponse
                                                          authTokenResponse) {
        return ResponseEntity.ok(authTokenResponse);
    }


    @PostMapping()
    public ResponseEntity<AuthTokenResponse> authenticateUserFromCredentials(@AuthenticationPrincipal AuthTokenResponse
                                                                                         authTokenResponse) {
        return ResponseEntity.ok(authTokenResponse);
    }

    @GetMapping("/test")
    public ResponseEntity<String> authTest()
    {
        return ResponseEntity.ok(SecurityContextHolder.getContext().toString());
    }


}
