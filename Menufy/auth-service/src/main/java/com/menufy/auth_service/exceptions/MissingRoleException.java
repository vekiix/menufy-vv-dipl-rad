package com.menufy.auth_service.exceptions;

import com.menufy.auth_service.utils.Messages;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class MissingRoleException extends RuntimeException{
    public MissingRoleException(){
        super(Messages.MISSING_ROLE_RECORD);
    }
}
