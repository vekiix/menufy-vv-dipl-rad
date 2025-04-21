package com.menufy.menu_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.UNAUTHORIZED)
public class InvalidJWTException extends RuntimeException {
    public InvalidJWTException(){
        super("Provided JWT token is invalid");
    }
}
