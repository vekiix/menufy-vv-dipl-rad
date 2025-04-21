package com.menufy.order_service.config;


import com.menufy.order_service.exceptions.JWTMissingException;
import com.menufy.order_service.service.AuthTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;
import java.util.regex.Pattern;

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
        } else if (!Pattern.matches("^/ws.*", request.getRequestURI())){
            System.out.println(request.getRequestURI());
            throw new JWTMissingException();
        }

        filterChain.doFilter(request, response);
    }
}
