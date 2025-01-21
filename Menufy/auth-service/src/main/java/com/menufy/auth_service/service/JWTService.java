package com.menufy.auth_service.service;

import com.menufy.auth_service.exceptions.InvalidJWTException;

import com.menufy.auth_service.models.Table;
import com.menufy.auth_service.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${SECRET}")
    private static final String SECRET = "a80760fd40fe446efdb63087307211907f408cd188221009b37681d491b3672c";

    @Value("${PUBLISHER}")
    private static final String PUBLISHER = "VV";

    @Value("${GUEST_TOKEN_LENGTH}")
    private static final long GUEST_TOKEN_LENGTH = 1000000;

    @Value("${USER_TOKEN_LENGTH}")
    private static final long USER_TOKEN_LENGTH = 864_000_000;

    public long getGuestTokenLength(){
        return GUEST_TOKEN_LENGTH;
    }

    public long getUserTokenLength(){
        return USER_TOKEN_LENGTH;
    }

    public String generateTokenForUser(User user) {
        Map<String, Object> claims = new HashMap<>(Map.of());
        claims.put("id", user.getId());
        claims.put("company", user.getCompany().getId());
        claims.put("role", user.getRole().getId());

        return Jwts
                .builder()
                .subject(user.getUsername())
                .issuer(PUBLISHER)
                .expiration(new Date(System.currentTimeMillis() + USER_TOKEN_LENGTH))
                .claim("user",claims)
                .signWith(getSignKey())
                .compact();
    }

    public String generateTokenForGuest(String cmac, Table table, int roleId) {
        Map<String, Object> claims = new HashMap<>(Map.of());
        claims.put("id", cmac);
        claims.put("company", table.getCompany().getId());
        claims.put("role", roleId);
        claims.put("table", table.getUid());

        return Jwts
                .builder()
                .subject("Guest-" + table.getUid())
                .issuer(PUBLISHER)
                .expiration(new Date(System.currentTimeMillis() + GUEST_TOKEN_LENGTH))
                .claim("guest", claims)
                .signWith(getSignKey())
                .compact();
    }

    public boolean validateToken(String _jwtToken) throws InvalidJWTException {
        final String userName = extractUserName(_jwtToken);
        return !userName.isEmpty() && !isTokenExpired(_jwtToken) && verifyToken(_jwtToken);
    }

    private boolean verifyToken(String _jwtToken){
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build().isSigned(_jwtToken);
    }

    // Checks whether the token is a User token by verifying if the "user" claim exists
    public boolean isUserToken(String _jwtToken) {
        try {
            Claims claims = extractAllClaims(_jwtToken);
            return claims.get("user") != null;
        } catch (Exception e) {
            return false; // Return false if any exception occurs while parsing
        }
    }

    // Checks whether the token is a Guest token by verifying if the "guest" claim exists
    public boolean isGuestToken(String _jwtToken) {
        try {
            Claims claims = extractAllClaims(_jwtToken);
            return claims.get("guest") != null;
        } catch (Exception e) {
            return false;
        }
    }


    private SecretKey getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserName(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        // Extract the specified claim using the provided function
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        // Parse and return all claims from the token
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build().parseSignedClaims(token).getPayload();
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }


    public String getUserIdFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        Map<String, Object> userClaims = (Map<String, Object>) claims.get("user");
        return String.valueOf(userClaims.get("id"));
    }

    public String getTableIdFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        Map<String, Object> userClaims = (Map<String, Object>) claims.get("guest");
        return String.valueOf(userClaims.get("table"));
    }

    public String getGuestIdFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        Map<String, Object> userClaims = (Map<String, Object>) claims.get("guest");
        return String.valueOf(userClaims.get("id"));
    }
}
