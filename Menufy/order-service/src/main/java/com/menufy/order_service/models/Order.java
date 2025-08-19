package com.menufy.order_service.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.menufy.order_service.dto.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@Data
@Document(collection = "orders") // Marks this class as a MongoDB document
public class Order {

    public Order() {
        this.createdAt = LocalDateTime.now();
    }

    @MongoId(FieldType.OBJECT_ID)  // Changed from @Id
    private String id;

    private String tableId;

    private String companyId;

    private OrderStatus status = OrderStatus.ORDERED;

    private String transactionToken;

    @JsonProperty("totalPrice")
    public double total() {
        if (lines != null) {
            BigDecimal total = lines.stream()
                    .map(line -> BigDecimal.valueOf(line.getItem().getPrice())
                            .multiply(BigDecimal.valueOf(line.getQuantity())))
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            return total.setScale(2, RoundingMode.HALF_UP).doubleValue();
        }
        return 0;
    }

    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime deliveredAt;
    private List<OrderLine> lines;

    public void addItemToLines(OrderLine orderLine) {
        if(this.lines == null){
            lines = new ArrayList<>();
        }
        lines.add(orderLine);
    }

    public void markOrderAsDelivered() {
        if(this.status != OrderStatus.IN_PROGRESS) {
            throw new RuntimeException("Order is in a non valid status");
        }
        this.status = OrderStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    public void markOrderAsPaid() {
        if(this.status != OrderStatus.DELIVERED) {
            throw new RuntimeException("Order is in a non valid status");
        }
        this.status = OrderStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    public void markOrderAsAccepted() {
        if(this.status != OrderStatus.ORDERED) {
            throw new RuntimeException("Order is in non valid status");
        }
        this.status = OrderStatus.IN_PROGRESS;
    }

    public void markOrderAsRejected() {
        if(this.status != OrderStatus.ORDERED) {
            throw new RuntimeException("Order is in non valid status");
        }
        this.status = OrderStatus.REJECTED;
    }
}
