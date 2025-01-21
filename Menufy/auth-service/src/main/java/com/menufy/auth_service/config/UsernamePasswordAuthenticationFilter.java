package com.menufy.auth_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.menufy.auth_service.dto.LoginRequest;
import com.menufy.auth_service.service.AuthTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class UsernamePasswordAuthenticationFilter extends OncePerRequestFilter {
    private final AuthTokenService authTokenService;

    public UsernamePasswordAuthenticationFilter(AuthTokenService _authTokenService){
        this.authTokenService = _authTokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        final ObjectMapper MAPPER = new ObjectMapper();

        if ("/login".equals(request.getServletPath())
                && HttpMethod.POST.matches(request.getMethod())) {
            LoginRequest loginRequest = MAPPER.readValue(request.getInputStream(), LoginRequest.class);

            try {
                SecurityContextHolder.getContext().setAuthentication(
                        authTokenService.createResponseForApplicationUser(loginRequest));
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                throw e;
            }
        }

        filterChain.doFilter(request,response);
    }
}
