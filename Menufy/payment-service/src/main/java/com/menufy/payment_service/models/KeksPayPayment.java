package com.menufy.payment_service.models;

import com.menufy.payment_service.dto.KeksPayPaymentDetails;
import lombok.Data;

import java.util.Base64;

@Data
public class KeksPayPayment {
    private int qr_type;
    private String cid;
    private String tid;
    private String phoneNumber;
    private String transactionId;

    public KeksPayPayment(KeksPayParameters companyParameters, KeksPayPaymentDetails paymentDetails){
        this.setQr_type(companyParameters.getQr_type());
        this.setCid(companyParameters.getCid());
        this.setTid(companyParameters.getTid());
        this.setPhoneNumber(paymentDetails.phoneNumber());
        this.setTransactionId(Base64.getEncoder()
                .encodeToString(this.toString().getBytes()));
    }
}
