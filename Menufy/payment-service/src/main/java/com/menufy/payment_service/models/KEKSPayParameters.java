package com.menufy.payment_service.models;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KEKSPayParameters {
    private int qr_type;
    private String cid;
    private String tid;
}
