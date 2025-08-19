package com.menufy.order_service.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.aggregation.BooleanOperators;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Table {
    private String companyId;
    private String uid;
    private String name;

    @DBRef
    private List<Order> activeOrders;

    public Table(String _companyId, String _id)
    {
        this.companyId = _companyId;
        this.uid = _id;
        this.activeOrders = new ArrayList<>();
    }

    public Optional<Order> findOrderOpt(String id)
    {
        return activeOrders.stream()
                .filter(table -> table.getId().equals(id))
                .findFirst();
    }


    public void addOrderToActiveOrderList(Order _order){
        if(this.getActiveOrders() == null){
            this.setActiveOrders(new ArrayList<>());
        }
        if(findOrderOpt(_order.getId()).isPresent()){
            throw new IllegalArgumentException("Provided order is already in active order list");
        }
        activeOrders.add(_order);
    }


    public void removeOrderFromActiveOrderList(Order _order) {
        if(this.getActiveOrders() == null){
            this.setActiveOrders(new ArrayList<>());
        }
        if (findOrderOpt(_order.getId()).isEmpty()){
            throw new IllegalArgumentException("Provided order does not exist in active order list");
        }
        if(!activeOrders.removeIf(aOrder -> aOrder.getId().equals(_order.getId()))){
            throw new IllegalArgumentException("There was a problem whiele deleting order");
        }
    }
}
