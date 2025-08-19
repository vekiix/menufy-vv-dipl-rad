package com.menufy.order_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "companies") // Marks this class as a MongoDB document
public class Company {

    @Id
    private String id;
    private String name;
    private String oib;
    public List<Table> tables;

    @DBRef
    public List<Item> items;

    @DBRef
    public List<Order> pendingOrders;

    public Optional<Table> findTableByIdOpt(String id)
    {
        return tables.stream()
                .filter(table -> table.getUid().equals(id))
                .findFirst();
    }


    public Optional<Item> findItemById(String id)
    {
        return items.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst();
    }

    public Optional<Order> findOrderById(String id)
    {
        return pendingOrders.stream()
                .filter(order -> order.getId().equals(id))
                .findFirst();
    }

    public Table findTableById(String id)
    {
        return tables.stream()
                .filter(table -> table.getUid().equals(id))
                .findFirst().orElseThrow(() -> new IllegalArgumentException("Provided Table does not exist in this Company"));
    }

    public void removePendingOrderById(String id) {
        boolean removed = pendingOrders.removeIf(pOrder -> pOrder.getId().equals(id));
        if (!removed) {
            throw new IllegalArgumentException("Cannot remove: Order with the given ID does not exist in this Company");
        }
    }

    public void addOrderToPendingOrderList(Order order){
        if(this.getPendingOrders() == null){
            this.setPendingOrders(new ArrayList<>());
        }else if (this.findOrderById(order.getId()).isPresent()){
            throw new IllegalArgumentException("Provided Order is already in this Company");
        }
        pendingOrders.add(order);
    }

    public void addItemToItemList(Item item){
        if(this.getItems() == null){
            this.setItems(new ArrayList<>());
        }
        if (this.findItemById(item.getId()).isPresent()){
            throw new IllegalArgumentException("Provided Item is already in this Company");
        }
        items.add(item);
    }



    public void removeOrderFromPendingOrderList(Order order) {
        if(this.getPendingOrders() == null){
            this.setPendingOrders(new ArrayList<>());
        }
        this.removePendingOrderById(order.getId());
    }

    public void removeItemFromItemList(Item item) {
        if(this.getItems() == null){
            this.setItems(new ArrayList<>());
        }
        if (!items.contains(item)){
            throw new IllegalArgumentException("Provided Item does not exist in this Company");
        }
        items.remove(item);
    }

    public void addOrderToActiveListOnTable(Order order) {
        Table table = this.findTableById(order.getTableId());
        table.addOrderToActiveOrderList(order);
    }

    public void removeOrderFromActiveListOnTable(Order order) {
        Table table = this.findTableById(order.getTableId());
        table.removeOrderFromActiveOrderList(order);
    }

    public void addOrUpdateTableFromTableList(Table table) {
        if(this.getTables() == null){
            this.setTables(new ArrayList<>());
        }
        Optional<Table> optTable = this.findTableByIdOpt(table.getUid());
        if (optTable.isPresent()){
            Table currTable = optTable.get();
            currTable.setUid(table.getUid());
            currTable.setName(table.getName());
        }
        else {
            this.tables.add(table);
        }
    }

    public void removeTableFromTableList(Table _table) {
        if(this.getTables() == null){
            this.setTables(new ArrayList<>());
        }
        Table table = this.findTableById(_table.getUid());
        tables.remove(table);
    }
}
