package com.menufy.order_service.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.menufy.order_service.models.Order;

public class OrderDto {
    public String companyId;
    public String orderId;
    public double totalPrice;

    public OrderDto(Order order) {
        this.orderId = order.getId();
        this.totalPrice = order.total();
        this.companyId = order.getCompanyId();
    }

    @Override
    public String toString()
    {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return ((ObjectWriter) ow).writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem while parsing 'ItemChangeDto'");
        }
    }
}
