package com.menufy.order_service.controller;

import com.menufy.order_service.dto.*;
import com.menufy.order_service.models.Order;
import com.menufy.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final OrderWSController orderWSController;


    @PostMapping()
    public ResponseEntity<OrderResponse> createOrderRequest(@RequestBody List<OrderLineRequest> orderLines){
        Order createdOrder = orderService.createOrder(orderLines);
        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(createdOrder.getId(),createdOrder.getCompanyId(),createdOrder.getStatus()));
        return ResponseEntity.ok(new OrderResponse(createdOrder));
    }


    @GetMapping("/deliver")
    public ResponseEntity<OrderResponse> markOrderAsDelivered(@RequestParam String orderId)
    {
        Order updatedOrder = orderService.setOrderAsDevelivered(orderId);
        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(updatedOrder.getId(), updatedOrder.getCompanyId(), updatedOrder.getStatus()));
        return ResponseEntity.ok(new OrderResponse(updatedOrder));
    }

    @GetMapping("/pay")
    public ResponseEntity<OrderResponse> markOrderAsPaid(@RequestParam String orderId)
    {
        Order updatedOrder = orderService.setOrderAsPaid(orderId);
        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(updatedOrder.getId(), updatedOrder.getCompanyId(), updatedOrder.getStatus()));
        return ResponseEntity.ok(new OrderResponse(updatedOrder));
    }


    @GetMapping("/active")
    public ResponseEntity<Object> getActiveOrders() {
        return ResponseEntity.ok(orderService.getAllActiveOrders());
    }

    @GetMapping("/paid")
    public ResponseEntity<OrdersResponse> getPendingOrders() {
        return ResponseEntity.ok(new OrdersResponse(orderService.getAllPaidOrders()));
    }
}
