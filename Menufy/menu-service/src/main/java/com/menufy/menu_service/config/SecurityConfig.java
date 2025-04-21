package com.menufy.menu_service.config;

import com.menufy.menu_service.services.AuthTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    ExceptionHandlingFilter exceptionHandlingFilter;
    AuthTokenService authTokenService;

    @Autowired
    public SecurityConfig(AuthTokenService _authTokenService, ExceptionHandlingFilter _exceptionHandlingFilter) {
        this.authTokenService = _authTokenService;
        this.exceptionHandlingFilter = _exceptionHandlingFilter;
    }


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .formLogin(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> { request
                        .requestMatchers(HttpMethod.GET, "/api/item", "/api/category", "/api/menu", "/api/item/**").hasAnyAuthority("USER", "GUEST")
                        .requestMatchers(HttpMethod.GET, "/api/category/**", "/api/menu/**").hasAuthority("USER")
                        .requestMatchers(HttpMethod.PUT, "/api/item", "/api/category").hasAuthority("USER")
                        .requestMatchers(HttpMethod.POST, "/api/item", "/api/category").hasAuthority("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/item", "/api/category").hasAuthority("USER")
                        .requestMatchers(HttpMethod.DELETE, "/api/user", "/api/company").hasAuthority("ADMIN")
                        .anyRequest().authenticated();
                })
                .addFilterBefore(new JWTAuthenticationFilter(authTokenService), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(this.exceptionHandlingFilter, LogoutFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();

    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
