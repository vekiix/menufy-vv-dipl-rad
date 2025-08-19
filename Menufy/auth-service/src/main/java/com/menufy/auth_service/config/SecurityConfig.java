package com.menufy.auth_service.config;

import com.menufy.auth_service.service.AuthTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.Arrays;
import java.util.List;

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
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(request -> {request
                        .requestMatchers(HttpMethod.GET, "/company", "/user").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/company", "/user").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/company", "/user").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/company", "/user").hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/table").hasAuthority("USER")
                        .requestMatchers(HttpMethod.PUT, "/table").hasAuthority("USER")
                        .requestMatchers(HttpMethod.POST, "/table").hasAuthority("USER")
                        .requestMatchers(HttpMethod.DELETE, "/table").hasAuthority("USER")
                        .requestMatchers("/login", "/login/*").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated();
                })
                .addFilterBefore(new UsernamePasswordAuthenticationFilter(authTokenService), BasicAuthenticationFilter.class)
                .addFilterBefore(new GetParametersAuthenticationFilter(authTokenService), BasicAuthenticationFilter.class)
                .addFilterBefore(new JWTAuthenticationFilter(authTokenService), UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(this.exceptionHandlingFilter, LogoutFilter.class)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .build();

    }

    @Bean
    CorsConfigurationSource corsConfigurationSource(){
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
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
