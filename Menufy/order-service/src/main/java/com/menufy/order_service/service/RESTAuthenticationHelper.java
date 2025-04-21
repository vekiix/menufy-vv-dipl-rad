package com.menufy.order_service.service;

import com.menufy.order_service.exceptions.JWTMissingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

public abstract class RESTAuthenticationHelper {
    protected HttpHeaders composeHeaders(){
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String authToken = extractAuthTokenFromCurrentRequest().orElseThrow(JWTMissingException::new);
        headers.set(HttpHeaders.AUTHORIZATION, authToken);
        return headers;
    }

    protected Optional<String> extractAuthTokenFromCurrentRequest() {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        return Optional.ofNullable(authorizationHeader);
    }
}
