package com.menufy.auth_service.exceptions;

import com.menufy.auth_service.utils.Messages;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class MissingUserException extends RuntimeException{
    public MissingUserException(){

        super(Messages.MISSING_USER_RECORD);
    }
}
