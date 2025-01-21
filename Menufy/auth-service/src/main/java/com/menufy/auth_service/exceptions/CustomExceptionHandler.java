package com.menufy.auth_service.exceptions;

import com.menufy.auth_service.dto.ExceptionResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.InvalidClaimException;
import io.jsonwebtoken.PrematureJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ExceptionResponse> handleValidationExceptions(MethodArgumentNotValidException ex, WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForInvalidFields(ex,wr);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResponse);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidCredentialsExceptions(InvalidCredentialsException ex, WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForCustomException(ex,wr);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(InvalidJWTException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidJWTExceptions(InvalidJWTException ex, WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForCustomException(ex,wr);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(JWTMissingException.class)
    public ResponseEntity<ExceptionResponse> handleMissingJWTExceptions(JWTMissingException ex, WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForCustomException(ex,wr);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ExceptionResponse> handleGenericException(final Exception ex , final WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForGenericException(ex, wr);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResponse);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ExceptionResponse> handleExpiredJwtException(final ExpiredJwtException ex, final WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForGenericException(ex, wr);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }

    @ExceptionHandler(InvalidClaimException.class)
    public ResponseEntity<ExceptionResponse> handleInvalidClaimException(final InvalidClaimException ex, final WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForGenericException(ex, wr);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exceptionResponse);
    }

    @ExceptionHandler(PrematureJwtException.class)
    public ResponseEntity<ExceptionResponse> handlePrematureJwtException(final PrematureJwtException ex, final WebRequest wr) {
        ExceptionResponse exceptionResponse = new ExceptionResponse();
        exceptionResponse.populateExceptionResponseForGenericException(ex, wr);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(exceptionResponse);
    }


}
