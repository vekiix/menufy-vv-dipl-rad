package com.menufy.menu_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "companies") // Marks this class as a MongoDB document
public class Company {
    public Company(String _id){
        id = _id;
        categories = new ArrayList<>();
        items = new ArrayList<>();
    }

    @Id // Marks this field as the primary key
    private String id; // Use String for MongoDB ObjectId

    private String name;

    private String oib;

    @DBRef // Reference to the Item documents
    private List<Item> items;

    @DBRef
    private List<Category> categories;

    @DBRef // Reference to the active Menu document
    private Menu menu;

    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    private void updateTimestamp() {
        this.updatedAt = LocalDateTime.now();
    }

    public void addItemToItemList(Item item){
        if(this.getItems() == null){
            this.setItems(new ArrayList<>());
        }else if (items.contains(item)){
            throw new IllegalArgumentException("Provided Item is already in this Company");
        }
        items.add(item);
    }

    public void addCategoryToCategoryList(Category category){
        if(this.getCategories() == null){
            this.setCategories(new ArrayList<>());
        }else if (categories.contains(category)){
            throw new IllegalArgumentException("Provided Category is already in this Company");
        }
        categories.add(category);
    }

    public Item findItemFromItemList(String itemId){
        if(this.getItems() == null){
            throw new IllegalArgumentException("Item with ID " + itemId + " not found");
        }
        return this.getItems().stream().filter(ite -> ite.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Item with ID " + itemId + " not found"));
    }

    public Category findCategoryFromCategoryList(String categoryId){
        if(this.getCategories() == null){
            throw new IllegalArgumentException("Category with ID " + categoryId + " not found");
        }
        return this.getCategories()
                .stream()
                .filter(cat -> cat.getId().equals(categoryId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Category with ID " + categoryId + " not found"));
    }

}