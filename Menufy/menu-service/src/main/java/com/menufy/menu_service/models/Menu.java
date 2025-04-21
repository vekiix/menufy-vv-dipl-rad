package com.menufy.menu_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@Builder
@Data
@Document(collection = "menus") // Marks this class as a MongoDB document
public class Menu implements Serializable {
    public Menu(){
        this.categories = new ArrayList<>();
    }

    @Id // Marks this field as the primary key
    private String id; // Use String for MongoDB ObjectId

    @DBRef // Reference to the Category documents
    private List<Category> categories;

    public void addCategoryToMenu(Category category){
        if(this.getCategories() == null){
            this.setCategories(new ArrayList<>());
        } else if (categories.contains(category)){
            throw new IllegalArgumentException("Provided Category is already on the Menu");
        }
        categories.add(category);
    }

    public void removeCategoryFromMenu(Category category) {
        if(this.getCategories() == null){
            this.setCategories(new ArrayList<>());
        }
        if(categories.contains(category)){
            categories.remove(category);
            return;
        }
        throw new IllegalArgumentException("Provided Category is not on the Menu");
    }
}