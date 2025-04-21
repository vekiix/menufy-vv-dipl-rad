package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.CompanyTable;

public class TableDto {
    public String uid;
    public String companyId;

    public TableDto(CompanyTable _table)
    {
        this.uid = _table.getUid();
        this.companyId = _table.getCompany().getId();
    }
}
