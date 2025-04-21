package com.menufy.order_service.models;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.menufy.order_service.dto.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "orders") // Marks this class as a MongoDB document
public class Order {

    @MongoId(FieldType.OBJECT_ID)  // Changed from @Id
    private String id;

    private String tableId;

    private String companyId;

    private OrderStatus status = OrderStatus.ORDERED;

    private String transactionToken;

    @JsonProperty("totalPrice")
    public float total(){
        if(lines != null){
            return BigDecimal.valueOf(lines.stream().mapToDouble(l  -> l.getItem().getPrice() * l.getQuantity()).count())
                    .setScale(2, RoundingMode.HALF_UP)
                    .floatValue();
        }
        return 0;
    }

    private final LocalDateTime createdAt = LocalDateTime.now();
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
        if(this.status == OrderStatus.DELIVERED && this.deliveredAt != null) {
            throw new RuntimeException("Order is already in status Delivered");
        }
        this.status = OrderStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    public void markOrderAsPaid() {
        if(this.status == OrderStatus.PAID && this.paidAt != null) {
            throw new RuntimeException("Order is already in status Paid");
        }
        this.status = OrderStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }
}
