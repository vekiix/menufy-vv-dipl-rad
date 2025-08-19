package com.menufy.payment_service.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class WSPayParameters {
    private String shopID;
    private String version;
    private boolean isValid = false;

    public WSPayParameters(String shopID, String version) {
        this.shopID = shopID;
        this.version = version;
    }

    public void validateParameters(){
        this.setValid(true);
    }
}
