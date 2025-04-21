package com.menufy.order_service.controller;

import com.menufy.order_service.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.text.SimpleDateFormat;

@Controller
public class OrderWSController{
    private final SimpMessagingTemplate simpMessagingTemplate;

    public OrderWSController(SimpMessagingTemplate simpMessagingTemplate, OrderObservable orderObservable) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // the business logic can call this to update all connected clients
    public void sendOrderChangeEvent(OrderChangeEventArgs dto) {
        this.simpMessagingTemplate.convertAndSend("/topic/messages", dto);
    }


}
