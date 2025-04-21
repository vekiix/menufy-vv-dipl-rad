package com.menufy.order_service.dto;

public interface Observer {
    void handleOrderChange (OrderChangeEventArgs args);
    void setCompanyId(String companyId);

    String getCompanyId();
}
