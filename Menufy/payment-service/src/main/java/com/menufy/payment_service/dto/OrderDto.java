package com.menufy.payment_service.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;

public class OrderDto {
    public String companyId;
    public String orderId;
    public double totalPrice;


    @Override
    public String toString()
    {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return ow.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem while parsing 'OrderDto'");
        }
    }
}
