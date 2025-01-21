package com.menufy.menu_service.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
public class Category {
    @Id
    @Column(nullable = false)
    private long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = true)
    private byte[] image;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;


    @ManyToMany(mappedBy = "categories")
    private List<Menu> menus;


    @ManyToMany
    @JoinTable(
            name = "Category_Item",
            joinColumns = @JoinColumn(name = "category_id"),
            inverseJoinColumns = @JoinColumn(name = "item_id")
    )
    private List<Item> items;


    public void addItemToCategory (Item _item) throws Exception {
        if(items.contains(_item)){
            throw new Exception("Item already exists in this category");
        }

        items.add(_item);
    }

}
