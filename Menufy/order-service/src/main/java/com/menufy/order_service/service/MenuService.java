package com.menufy.order_service.service;

import com.menufy.order_service.dto.ItemResponse;
import com.menufy.order_service.exceptions.JWTMissingException;
import com.menufy.order_service.models.Item;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenuService extends RESTAuthenticationHelper{
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${menu-service.endpoint-url}")
    private String menuServiceUrl;


    public Item fetchItemById(String itemId) {
        HttpEntity<String[]> requestEntity = new HttpEntity<>(this.composeHeaders());

        try {
            ResponseEntity<ItemResponse> responseEntity = restTemplate.exchange(
                    menuServiceUrl + itemId,
                    HttpMethod.GET,
                    requestEntity,
                    new ParameterizedTypeReference<>() {}
            );
            return responseEntity.getBody().item();

        }catch (Exception e){
            throw new RuntimeException("There was a problem while fetching Item with ID " + itemId + " from menu-service. " + e.getMessage());
        }
    }



}
