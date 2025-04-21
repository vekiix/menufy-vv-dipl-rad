package com.menufy.menu_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "items") // Marks this class as a MongoDB document
public class Item {
    @MongoId(FieldType.OBJECT_ID)  // Changed from @Id
    private String id; // Use String for MongoDB ObjectId

    private String name; // Name of the item

    private String description; // Description of the item

    private String portion; // Portion size of the item

    private float price; // Price of the item

    private byte[] image; // Image associated with the item
}