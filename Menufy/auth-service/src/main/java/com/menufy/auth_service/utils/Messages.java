package com.menufy.auth_service.utils;

public class Messages {
    public static final String IS_NULL_ERROR = " field is missing in request body";
    public static final String IS_BLANK_ERROR = " field is blank";
    public static final String INVALID_CREDENTIALS_ERROR = "Provided credentials are invalid";
    public static final String CREATE_JWT_SCOPE = "CREATE";
    public static final String UPDATE_JWT_SCOPE = "UPDATE";
    public static final String INVALID_JWT = "Provided JWT is not valid";

    public static final String MISSING_JWT = "JWT is missing from the request";
    public static final String INVALID_REQUEST_PARAMS = "Given request parameters are not valid";
    public static final String MISSING_ROLE_RECORD = "Selected role is missing in the database";
}
