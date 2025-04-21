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
    public static final String MISSING_ROLE_RECORD = "Provided Role ID does not exist";
    public static final String MISSING_COMPANY_RECORD = "Provided Company ID does not exist";
    public static final String MISSING_TABLE_RECORD = "Provided Table ID does not exist";
    public static final String MISSING_USER_RECORD = "Provided User ID does not exist";
    public static final String MISSING_GUEST_RECORD ="Provided CMAC does not exist" ;
    public static final String USERNAME_TAKEN_EXCEPTION = "Provided username is already taken";
    public static final String OIB_TAKEN_EXCEPTION = "Provided Company OIB is already taken";
    public static final String ACCESS_NOT_ALLOWED = "You do not have permission for this action";
    public static final String UID_TAKEN_EXCEPTION = "Provided Table UID is already taken";
}
