package com.menufy.order_service.dto;

import org.springframework.stereotype.Component;

@Component
public class OrderObserver implements Observer{
    String companyId;

    @Override
    public void handleOrderChange(OrderChangeEventArgs args) {

    }

    @Override
    public void setCompanyId(String companyId) {
        this.companyId = companyId;
    }

    @Override
    public String getCompanyId() {
        return this.companyId;
    }
}
