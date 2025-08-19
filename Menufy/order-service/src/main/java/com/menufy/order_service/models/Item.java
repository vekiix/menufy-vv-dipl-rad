package com.menufy.order_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "items") // Marks this class as a MongoDB document
public class Item {
    @MongoId(FieldType.OBJECT_ID)  // Changed from @Id
    private String id; // Use String for MongoDB ObjectId

    private String companyId;

    private String name; // Name of the item

    private float price; // Price of the item

}
