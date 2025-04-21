package com.menufy.order_service.dto;

import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;

public class GuestClaims extends BaseClaims {
    private String username;
    private String cmac;
    private String company;
    private String table;


    public GuestClaims(String _username, String _cmac,
                       String _company, String _table) {
        this.username = _username;
        this.cmac = _cmac;
        this.company = _company;
        this.table = _table;
    }


    @Override
    public String getCompanyId() {
        return company;
    }

    @Override
    public int getRoleId() {
        return 0;
    }

    @Override
    public String getIdentification() {
        return cmac;
    }

    @Override
    public String getTableId() {
        return table;
    }

}
