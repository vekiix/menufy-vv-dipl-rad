package com.menufy.order_service.service;

import com.menufy.order_service.controller.OrderWSController;
import com.menufy.order_service.dto.BaseClaims;
import com.menufy.order_service.dto.OrderChangeEventArgs;
import com.menufy.order_service.dto.OrderLineRequest;
import com.menufy.order_service.dto.OrderStatus;
import com.menufy.order_service.models.Item;
import com.menufy.order_service.models.Order;
import com.menufy.order_service.models.OrderLine;
import com.menufy.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final ItemService itemService;

    private Order findOrderById(String orderId){
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if(orderOpt.isPresent()){
            return orderOpt.get();
        }
        throw new RuntimeException("Missing order ID");
    }

    public Order createOrder(List<OrderLineRequest> orderLines) {
        Order order = new Order();
        orderLines.forEach(orderLineRequest -> {
            Item item = itemService.findOrFetchItem(orderLineRequest.item());
            OrderLine orderLine = new OrderLine();
            orderLine.setItem(item);
            orderLine.setQuantity(orderLineRequest.quantity());
            order.addItemToLines(orderLine);
        });

        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        order.setTableId(claims.getTableId());
        order.setCompanyId(claims.getCompanyId());
        orderRepository.save(order);
        return order;
    }

    public Order setOrderAsDevelivered(String orderId){
        Order order = this.findOrderById(orderId);
        order.markOrderAsDelivered();
        return orderRepository.save(order);
    }

    public Order setOrderAsPaid(String orderId){
        Order order = this.findOrderById(orderId);
        order.markOrderAsPaid();
        return orderRepository.save(order);
    }

    public List<Order> getAllActiveOrders() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderRepository.findByStatusAndCompanyId(OrderStatus.IN_PROGRESS, claims.getCompanyId());
    }

    public List<Order> getAllPaidOrders() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderRepository.findByStatusAndCompanyId(OrderStatus.PAID, claims.getCompanyId());
    }


}
