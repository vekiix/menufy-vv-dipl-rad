package com.menufy.order_service.dto;


import com.menufy.order_service.models.Table;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TableDto {
    public String uid;
    public String companyId;
    public String name;

    public TableDto(Table table) {
        this.uid = table.getUid();
        this.companyId = table.getCompanyId();
        this.name = table.getName();
    }
}
