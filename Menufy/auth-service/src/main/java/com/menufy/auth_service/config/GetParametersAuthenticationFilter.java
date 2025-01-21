package com.menufy.auth_service.config;

import com.menufy.auth_service.exceptions.InvalidRequestParametersException;
import com.menufy.auth_service.service.AuthTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class GetParametersAuthenticationFilter extends OncePerRequestFilter {
    private final AuthTokenService authTokenService;

    public GetParametersAuthenticationFilter(AuthTokenService authTokenService) {
        this.authTokenService = authTokenService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException  {
        if ("/login".equals(request.getServletPath()) && HttpMethod.GET.matches(request.getMethod())) {
            String uid = request.getParameter("uid");
            String ctr = request.getParameter("ctr");
            String cmac = request.getParameter("cmac");

            if (uid == null || ctr == null || cmac == null) {
                throw new InvalidRequestParametersException();
            }

            try {
                // Perform authentication with the provided parameters
                SecurityContextHolder.getContext().setAuthentication(
                        authTokenService.createResponseForNFCGuest(uid, ctr, cmac));
            } catch (Exception e) {
                SecurityContextHolder.clearContext();
                throw e;
            }
        }

        filterChain.doFilter(request, response);
    }
}

