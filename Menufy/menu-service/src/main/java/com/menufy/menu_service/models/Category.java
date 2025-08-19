package com.menufy.menu_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Data
@Document(collection = "categories") // Marks this class as a MongoDB document
public class Category {
    public Category(){
        this.items = new ArrayList<>();
    }

    @Id // Marks this field as the primary key
    private String id; // Use String for MongoDB ObjectId

    private String name; // Name of the category

    private byte[] image; // Image associated with the category

    @DBRef // Reference to the Item documents
    private List<Item> items;

    /**
     * Adds an item to the category.
     *
     * @param _item The item to add.
     */
    public void addItemToCategory(Item _item) {
        if(items == null){
            items = new ArrayList<>();
        } else if (items.contains(_item)){
            throw new IllegalArgumentException("Provided Item is already in this category");
        }
        items.add(_item);
    }

    public void removeItemFromCategory(Item item) {
        if(items == null){
            items = new ArrayList<>();
        }else if (!items.contains(item)){
            throw new IllegalArgumentException("Provided Item does not exist in this category");
        }
        items.remove(item);
    }
}