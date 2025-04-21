package com.menufy.auth_service.dto;

import org.springframework.security.web.webauthn.api.Bytes;
import org.springframework.security.web.webauthn.api.PublicKeyCredentialUserEntity;

public class GuestClaims extends BaseClaims implements PublicKeyCredentialUserEntity {
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
    public String getName() {
        return table;
    }

    @Override
    public Bytes getId() {
        return Bytes.fromBase64(cmac);
    }

    @Override
    public String getDisplayName() {
        return username;
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
        return table;
    }
}
