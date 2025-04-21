package com.menufy.payment_service.config;


import com.menufy.payment_service.exceptions.JWTMissingException;
import com.menufy.payment_service.service.AuthTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    AuthTokenService authTokenService;

    public JWTAuthenticationFilter(AuthTokenService _authTokenService){
        this.authTokenService = _authTokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
        String token = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (token != null && token.startsWith("Bearer ")) {
            String[] authElements = token.split(" ");
            try {
                SecurityContextHolder.getContext().setAuthentication(authTokenService.validateToken(authElements[1]));
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                throw e;
            }
        } else {
            throw new JWTMissingException();
        }

        filterChain.doFilter(request, response);
    }
}
