package com.menufy.order_service.service;

import com.menufy.order_service.dto.ItemResponse;
import com.menufy.order_service.dto.PaymentResponse;
import com.menufy.order_service.models.Item;
import com.menufy.order_service.models.Order;
import org.apache.tomcat.util.json.JSONParser;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

public class PaymentService extends RESTAuthenticationHelper{
    @Value("${payment-service.endpoint-url}")
    private String paymentServiceURL;

    private final RestTemplate restTemplate = new RestTemplate();


    public PaymentResponse createPaymentRequest(Order order) {
        HttpEntity<String> requestEntity = new HttpEntity<>(order.toString(), this.composeHeaders());

        try {
            ResponseEntity<PaymentResponse> responseEntity = restTemplate.exchange(
                    paymentServiceURL,
                    HttpMethod.POST,
                    requestEntity,
                    new ParameterizedTypeReference<>() {}
            );
            return responseEntity.getBody();

        }catch (Exception e){
            throw new RuntimeException("There was a problem while fetching Item with ID " + " from menu-service");
        }
    }
}
