package com.menufy.order_service.controller;

import com.menufy.order_service.dto.*;
import com.menufy.order_service.models.Order;
import com.menufy.order_service.service.OrderService;
import com.menufy.order_service.service.PaymentService;
import com.mongodb.lang.Nullable;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
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

    @GetMapping("/table")
    public ResponseEntity<OrdersResponse> tableOrders()
    {
        return ResponseEntity.ok(new OrdersResponse(orderService.getAllTableOrders()));
    }

    @GetMapping("/accept")
    public ResponseEntity<TablesResponse> markOrderAsAccepted(@RequestParam String order)
    {
        Order updatedOrder = orderService.setOrderAsAccepted(order);
        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(updatedOrder.getId(), updatedOrder.getCompanyId(), updatedOrder.getStatus()));
        return ResponseEntity.ok(new TablesResponse(orderService.getAllActiveOrders()));
    }

    @GetMapping("/reject")
    public ResponseEntity<TablesResponse> markOrderAsRejected(@RequestParam String order)
    {
        Order updatedOrder = orderService.setOrderAsRejected(order);
        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(updatedOrder.getId(), updatedOrder.getCompanyId(), updatedOrder.getStatus()));
        return ResponseEntity.ok(new TablesResponse(orderService.getAllActiveOrders()));
    }

    @GetMapping("/deliver")
    public ResponseEntity<TablesResponse> markOrderAsDelivered(@RequestParam String order)
    {
        Order updatedOrder = orderService.setOrderAsDevelivered(order);

        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(updatedOrder.getId(), updatedOrder.getCompanyId(), updatedOrder.getStatus()));
        return ResponseEntity.ok(new TablesResponse(orderService.getAllActiveOrders()));
    }

    @GetMapping("/pay")
    public ResponseEntity<TablesResponse> markOrderAsPaid(@RequestParam String order)
    {
        Order updatedOrder = orderService.processOrderPayment(new PaymentDto(order,"" ,PaymentStatus.ACCEPTED));
        orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(updatedOrder.getId(), updatedOrder.getCompanyId(), updatedOrder.getStatus()));
        return ResponseEntity.ok(new TablesResponse(orderService.getAllActiveOrders()));
    }


    @GetMapping("/active")
    public ResponseEntity<TablesResponse> getActiveOrders() {
        return ResponseEntity.ok(new TablesResponse(orderService.getAllActiveOrders()));
    }

    @GetMapping("/pending")
    public ResponseEntity<OrdersResponse> getPendingOrders() {
        return ResponseEntity.ok(new OrdersResponse(orderService.getAllPendingOrders()));
    }

    @PostMapping("/filter")
    public ResponseEntity<OrdersResponse> getFilteredOrders(@Nullable @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date from,
                                                            @Nullable @RequestParam @DateTimeFormat(pattern = "dd.MM.yyyy") Date to,
                                                            @RequestBody OrderFilterRequest orderFilterRequest){
        return ResponseEntity.ok(new OrdersResponse(orderService.getFilteredOrders(orderFilterRequest, from, to)));
    }
}
