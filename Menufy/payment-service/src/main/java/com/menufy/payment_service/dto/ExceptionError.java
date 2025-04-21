package com.menufy.payment_service.dto;

import org.springframework.http.HttpStatus;

import java.sql.Timestamp;


public class ExceptionError {
    public int httpStatus;
    public String path;
    public String detail;
    public Timestamp timestamp;

    public ExceptionError(String message, HttpStatus status, String path)
    {
        this.detail = message;
        this.httpStatus = status.value();
        this.path = path;
        this.timestamp = new Timestamp(System.currentTimeMillis());
    }

}
