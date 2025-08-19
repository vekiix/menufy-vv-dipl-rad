package com.menufy.payment_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
@Document(collection = "company") // Marks this class as a MongoDB document
public class Company {
    @MongoId // Marks this field as the primary key
    private String id; // Use String for MongoDB ObjectId

    private KeksPayParameters keksPayParameters;

    private WSPayParameters wsPayParameters;

    private String name;

    private String oib;

    public void validateKeksPayParameters() {
        //perform logic for validating KeksPayParameters
        this.keksPayParameters.validateParameters();
    }

    public void validateWSPayParameters() {
        //perform logic for validating KeksPayParameters
        this.wsPayParameters.validateParameters();
    }
}
