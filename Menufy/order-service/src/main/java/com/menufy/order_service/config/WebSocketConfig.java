package com.menufy.order_service.config;

import com.menufy.order_service.dto.OrderObservable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.*;

import javax.annotation.PostConstruct;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    private final OrderObservable orderObservable;

    @Autowired
    public WebSocketConfig(OrderObservable orderObservable) {
        this.orderObservable = orderObservable;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("registry registered");
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://127.0.0.1:5500") // Allow requests from the React frontend
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker with destination prefix /topic
        config.enableSimpleBroker("/topic");
        // Set the application destination prefix for message mapping methods
        config.setApplicationDestinationPrefixes("/app");
    }


    @PostConstruct
    public void registerObservers() {
        System.out.println("Observer registered");
        //observers.forEach(orderService::registerObserver);
    }


}
