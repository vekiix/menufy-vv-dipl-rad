package com.menufy.auth_service.exceptions;

import com.menufy.auth_service.utils.Messages;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.UNAUTHORIZED)
public class JWTMissingException extends RuntimeException {
    public JWTMissingException(){
        super(Messages.MISSING_JWT);
    }
}
