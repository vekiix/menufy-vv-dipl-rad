package com.menufy.menu_service.dto;

import com.menufy.menu_service.exceptions.ExceptionError;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;

import java.util.ArrayList;
import java.util.List;

public class ExceptionResponse {
    public List<ExceptionError> errors = new ArrayList<>();

    public void populateExceptionResponseForInvalidFields(MethodArgumentNotValidException ex, WebRequest wr)
    {
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            String message = fieldError.getField() + fieldError.getDefaultMessage();
            String pointer = ((ServletWebRequest)wr).getRequest().getRequestURI();
            this.errors.add(new ExceptionError(message, HttpStatus.BAD_REQUEST, pointer));
        });
    }

    public void populateExceptionResponseForGenericException(Exception ex, WebRequest wr) {
        String pointer = ((ServletWebRequest)wr).getRequest().getRequestURI();
        this.errors.add(new ExceptionError(ex.getMessage(),HttpStatus.BAD_REQUEST, pointer));
    }

    public void populateExceptionResponseForCustomException(Exception ex, WebRequest wr) {
        String pointer = ((ServletWebRequest)wr).getRequest().getRequestURI();
        ResponseStatus responseStatus = ex.getClass().getAnnotation(ResponseStatus.class);
        this.errors.add(new ExceptionError(ex.getMessage(), responseStatus.value() ,pointer));    }
}
