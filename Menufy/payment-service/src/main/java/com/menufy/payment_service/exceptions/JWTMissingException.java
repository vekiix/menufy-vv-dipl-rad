package com.menufy.payment_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.UNAUTHORIZED)
public class JWTMissingException extends RuntimeException {
    public JWTMissingException(){
        super("JWT token is missing");
    }
}
