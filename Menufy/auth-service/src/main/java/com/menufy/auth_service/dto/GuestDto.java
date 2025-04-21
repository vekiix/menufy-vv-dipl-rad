package com.menufy.auth_service.dto;

import com.menufy.auth_service.models.Guest;

public class GuestDto {
    public String CMAC;
    public int scanCount;
    public String table;
    public String company;
    public String role;

    public GuestDto (Guest guest)
    {
        CMAC = guest.getCMAC();
        scanCount = guest.getScanCount();
        table = guest.getTable().toString();
        company = guest.getTable().getCompany().toString();
        role = guest.getRole().toString();
    }
}
