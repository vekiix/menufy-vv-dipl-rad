package com.menufy.payment_service.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class KeksPayParameters {
    private int qr_type;
    private String cid;
    private String tid;
    private boolean isValid = false;


    public KeksPayParameters (int qr_type, String cid, String tid)
    {
        this.qr_type = qr_type;
        this.cid = cid;
        this.tid = tid;
    }

    public void validateParameters(){
        this.setValid(true);
    }

}
