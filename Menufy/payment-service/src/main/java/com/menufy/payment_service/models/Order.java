package com.menufy.payment_service.models;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;


@AllArgsConstructor
@Builder
@Data
public class Order {

    @MongoId(FieldType.OBJECT_ID)
    private String id;

    private String companyId;

    private float totalPrice;

}
