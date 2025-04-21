package com.menufy.payment_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Builder
@Data
@Document(collection = "company_parameters") // Marks this class as a MongoDB document
public class CompanyParameters{
    @MongoId // Marks this field as the primary key
    private String id; // Use String for MongoDB ObjectId




}
