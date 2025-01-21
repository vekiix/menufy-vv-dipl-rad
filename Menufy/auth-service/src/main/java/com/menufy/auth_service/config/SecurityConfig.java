package com.menufy.auth_service.config;

import com.menufy.auth_service.service.AuthTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final AuthTokenService authTokenService;
    private final ExceptionHandlingFilter exceptionHandlingFilter;


    @Autowired
    public SecurityConfig(AuthTokenService authTokenService, ExceptionHandlingFilter _exceptionHandlingFilter) {
        this.authTokenService = authTokenService;
        this.exceptionHandlingFilter = _exceptionHandlingFilter;
    }


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .formLogin(AbstractHttpConfigurer::disable)
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(request -> {
                    request
                            .requestMatchers("/login", "/login/*").permitAll()
                            .anyRequest().permitAll();
                })
                .addFilterBefore(new UsernamePasswordAuthenticationFilter(authTokenService), BasicAuthenticationFilter.class)
                .addFilterBefore(new GetParametersAuthenticationFilter(authTokenService), BasicAuthenticationFilter.class)
                .addFilterBefore(new JWTAuthenticationFilter(authTokenService), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(this.exceptionHandlingFilter, LogoutFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();

    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
