package com.menufy.payment_service.models;


import com.menufy.payment_service.dto.WSPayPaymentDetails;
import lombok.Data;

import java.util.Base64;

@Data
public class WSPayPayment {
    private String ShopID;
    private String version;
    private String firstName;
    private String lastName;
    private String bankCardNumber;
    private String transactionId;

    public WSPayPayment(WSPayParameters companyParameters, WSPayPaymentDetails paymentDetails){
        this.setShopID(companyParameters.getShopID());
        this.setVersion(companyParameters.getVersion());
        this.setFirstName(paymentDetails.firstName());
        this.setLastName(paymentDetails.lastName());
        this.setBankCardNumber(paymentDetails.cardNumber());
        this.setTransactionId(Base64.getEncoder()
                .encodeToString(this.toString().getBytes()));
    }
}
