package com.menufy.auth_service.exceptions;

import com.menufy.auth_service.utils.Messages;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.UNAUTHORIZED)
public class InvalidRequestParametersException extends RuntimeException {
    public InvalidRequestParametersException(){
        super(Messages.INVALID_REQUEST_PARAMS);
    }
}
