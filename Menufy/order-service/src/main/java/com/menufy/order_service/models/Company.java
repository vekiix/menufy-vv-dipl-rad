package com.menufy.order_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "companies") // Marks this class as a MongoDB document
public class Company {

    @Id
    private String id;

    public Company(String _id){
        id = _id;
        tables = new ArrayList<>();
    }

    private String name;

    private String oib;

    public List<Table> tables;
}
