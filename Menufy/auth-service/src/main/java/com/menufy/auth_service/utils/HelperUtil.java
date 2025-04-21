package com.menufy.auth_service.utils;

import java.security.SecureRandom;

public class HelperUtil {
    private static final String CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


    public static String generatePassword(int passLength) {
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(passLength);

        for (int i = 0; i < passLength; i++) {
            int index = random.nextInt(CHAR_POOL.length());
            password.append(CHAR_POOL.charAt(index));
        }

        return password.toString();
    }
}
