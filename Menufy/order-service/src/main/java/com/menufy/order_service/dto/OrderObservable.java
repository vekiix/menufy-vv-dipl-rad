package com.menufy.order_service.dto;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class OrderObservable{
    public static List<Observer> observerList = new CopyOnWriteArrayList<>();

    public static void subscribe(Observer observer){
        observerList.add(observer);
    }

    public static void notifyObservers(String companyId, String orderId, OrderStatus orderStatus){
        for(Observer o: observerList){
            if(o.getCompanyId().equals(companyId)){
            }
        }
    }
}
