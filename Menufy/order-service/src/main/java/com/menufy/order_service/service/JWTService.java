package com.menufy.order_service.service;

import com.menufy.order_service.dto.GuestClaims;
import com.menufy.order_service.dto.UserClaims;
import com.menufy.order_service.exceptions.InvalidJWTException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    @Value("${auth-service.auth-secret}")
    private String SECRET;

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
        if(isUserToken(jwtToken)){
            Map<String, Object> userClaims = (Map<String, Object>) claims.get("user");
            return String.valueOf(userClaims.get("id"));
        }
        throw new InvalidJWTException();
    }

    public String getTableIdFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        Map<String, Object> userClaims = (Map<String, Object>) claims.get("guest");
        return String.valueOf(userClaims.get("table"));
    }

    public String getGuestCmacFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        Map<String, Object> userClaims = (Map<String, Object>) claims.get("guest");
        return String.valueOf(userClaims.get("cmac"));
    }

    public String getCompanyIdFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        if(isUserToken(jwtToken)){
            Map<String, Object> userClaims = (Map<String, Object>) claims.get("user");
            return String.valueOf(userClaims.get("company"));
        }
        if(isGuestToken(jwtToken)){
            Map<String, Object> userClaims = (Map<String, Object>) claims.get("guest");
            return String.valueOf(userClaims.get("company"));
        }
        throw new InvalidJWTException();
    }

    public int getRoleIdFromClaims(String jwtToken) {
        Claims claims = extractAllClaims(jwtToken);
        if(isUserToken(jwtToken)){
            Map<String, Object> userClaims = (Map<String, Object>) claims.get("user");
            return Integer.parseInt(String.valueOf(userClaims.get("role")));
        }
        throw new InvalidJWTException();
    }

    public UserClaims parseUserJWTToken(String jwtToken) {
       return new UserClaims(extractUserName(jwtToken), getCompanyIdFromClaims(jwtToken),
              getUserIdFromClaims(jwtToken),getRoleIdFromClaims(jwtToken));
    }

    public GuestClaims parseGuestJWTToken(String jwtToken) {
        return new GuestClaims(extractUserName(jwtToken), getGuestCmacFromClaims(jwtToken),
                getCompanyIdFromClaims(jwtToken),getTableIdFromClaims(jwtToken));
    }
}
