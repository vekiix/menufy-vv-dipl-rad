package com.menufy.order_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value= HttpStatus.BAD_REQUEST)
public class ItemMissingException extends RuntimeException {
    public ItemMissingException(){
        super("Provided Item ID is missing");
    }
}
