package com.menufy.order_service.service;

import com.menufy.order_service.dto.*;
import com.menufy.order_service.models.Item;
import com.menufy.order_service.models.Order;
import com.menufy.order_service.models.OrderLine;
import com.menufy.order_service.models.Table;
import com.menufy.order_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final MongoTemplate mongoTemplate;
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;
    private final ItemService itemService;
    private final CompanyService companyService;

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
            Item item = itemService.findItemById(orderLineRequest.item());
            OrderLine orderLine = new OrderLine();
            orderLine.setItem(item);
            orderLine.setQuantity(orderLineRequest.quantity());
            order.addItemToLines(orderLine);
        });

        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        order.setTableId(claims.getTableId());
        order.setCompanyId(claims.getCompanyId());

        orderRepository.save(order);
        companyService.addOrderToPendingOrderList(order);

        return order;
    }

    public Order setOrderAsAccepted(String orderId) {
        Order order = this.findOrderById(orderId);
        order.markOrderAsAccepted();
        companyService.migrateOrderFromPendingToActive(order);
        return orderRepository.save(order);
    }

    public Order setOrderAsRejected(String orderId) {
        Order order = this.findOrderById(orderId);
        order.markOrderAsRejected();
        companyService.removeOrderFromPending(order);
        return orderRepository.save(order);
    }

    public Order setOrderAsDevelivered(String orderId){
        Order order = this.findOrderById(orderId);
        paymentService.createPaymentRequest(order);
        order.markOrderAsDelivered();
        return orderRepository.save(order);
    }

    public Order processPaymentDto(PaymentDto paymentDto){
        return switch (paymentDto.paymentStatus){
            case ACCEPTED -> this.processOrderPayment(paymentDto);
            case PENDING -> this.setOrderPaymentTransaction(paymentDto.orderId, paymentDto.transactionId);
        };
    }

    private Order setOrderPaymentTransaction(String orderId, String transactionId) {
        Order order = this.findOrderById(orderId);
        order.setTransactionToken(transactionId);
        return orderRepository.save(order);
    }

    public Order processOrderPayment(PaymentDto paymentDto){
        Order order = this.findOrderById(paymentDto.orderId);
        order.markOrderAsPaid();
        companyService.removeOrderFromActive(order);
        return orderRepository.save(order);
    }

    public List<Table> getAllActiveOrders() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return companyService.getTableList(claims.getCompanyId());
    }

    public List<Order> getAllPaidOrders() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderRepository.findByStatusAndCompanyId(OrderStatus.PAID, claims.getCompanyId());
    }

    public List<Order> getAllTableOrders(){
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return orderRepository.findByTableIdWithStatus(claims.getTableId(), List.of(OrderStatus.ORDERED.toString(), OrderStatus.DELIVERED.toString(), OrderStatus.IN_PROGRESS.toString()));
    }


    public List<Order> getAllPendingOrders() {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return companyService.getCompanyPendingOrders(claims.getCompanyId());
    }

    public List<Order> getFilteredOrders(OrderFilterRequest filterRequest, Date from, Date to) {
        BaseClaims claims = (BaseClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("companyId").is(claims.getCompanyId()));

        // Filter by tableId
        if (filterRequest.tableId() != null && !filterRequest.tableId().isBlank()) {
            List<String> tables = Arrays.stream(filterRequest.tableId().split(";"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            criteriaList.add(Criteria.where("tableId").in(tables));
        }

        if (filterRequest.orderId() != null && !filterRequest.orderId().isBlank()) {
            List<String> orders = Arrays.stream(filterRequest.orderId().split(";"))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();
            criteriaList.add(Criteria.where("id").in(orders));
        }

        if (filterRequest.status() != null && !filterRequest.status().isBlank()) {
                List<OrderStatus> statuses = Arrays.stream(filterRequest.status().split(";"))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .map(s -> {
                            try {
                                return OrderStatus.valueOf(s);
                            } catch (IllegalArgumentException e) {
                                return null;
                            }
                        })
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList());
                criteriaList.add(Criteria.where("status").in(statuses));
        }

        // Date range filter
        if (from != null) {
            criteriaList.add(Criteria.where("createdAt").gte(from.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().atStartOfDay()));
        }

        if(to != null){
            criteriaList.add(Criteria.where("createdAt").lte(to.toInstant().atZone(ZoneId.systemDefault()).toLocalDate().atTime(LocalTime.MAX)));
        }

        // Combine all criteria
        Criteria finalCriteria = new Criteria();
        finalCriteria.andOperator(criteriaList.toArray(new Criteria[0]));

        Query query = new Query(finalCriteria);
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        return mongoTemplate.find(query, Order.class);
    }
}
