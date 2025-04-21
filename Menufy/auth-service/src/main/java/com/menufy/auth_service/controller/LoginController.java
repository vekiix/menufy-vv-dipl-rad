package com.menufy.auth_service.controller;


import com.menufy.auth_service.dto.AuthTokenResponse;
import com.menufy.auth_service.service.AuthTokenService;
import com.menufy.auth_service.service.CryptographyService;
import com.menufy.auth_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


import java.util.Map;

@RestController
@RequestMapping("/login")
@RequiredArgsConstructor
public class LoginController {

    private final UserService userService;
    private final AuthTokenService authTokenService;
    private final CryptographyService cryptographyService;

    @GetMapping()
    public ResponseEntity<AuthTokenResponse> authenticateUserFromNFCScan(@AuthenticationPrincipal AuthTokenResponse
                                                          authTokenResponse) {
        return ResponseEntity.ok(authTokenResponse);
    }

    @PostMapping()
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<AuthTokenResponse> authenticateUserFromCredentials(@AuthenticationPrincipal AuthTokenResponse
                                                                                         authTokenResponse) {
        return ResponseEntity.ok(authTokenResponse);
    }

    @GetMapping("/test")
    public ResponseEntity<Authentication> authenticateTest() {
        return ResponseEntity.ok(SecurityContextHolder.getContext().getAuthentication());
    }


    @GetMapping("/next")
    public ResponseEntity<Map<String,String>> nextValidRequestURL(){
        return ResponseEntity.ok(authTokenService.getNextGuestValidRequestURL());
    }

}
