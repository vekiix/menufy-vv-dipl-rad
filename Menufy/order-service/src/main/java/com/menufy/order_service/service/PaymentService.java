package com.menufy.order_service.service;

import com.menufy.order_service.dto.OrderDto;
import com.menufy.order_service.dto.PaymentDto;
import com.menufy.order_service.models.Order;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class PaymentService {
    @Value("${payment-service.endpoint-url}")
    private String paymentServiceURL;

    private final RestTemplate restTemplate = new RestTemplate();


    public void createPaymentRequest(Order order) {
        HttpEntity<String> requestEntity = new HttpEntity<>(new OrderDto(order).toString(), RESTAuthenticationHelper.composeHeaders());
        try {
            restTemplate.exchange(
                    paymentServiceURL,
                    HttpMethod.POST,
                    requestEntity,
                    Void.class
            );
        }catch (Exception e){
            System.out.print(e.getMessage());
            throw new RuntimeException("There was a problem while sending a Payment transaction");
        }
    }
}
