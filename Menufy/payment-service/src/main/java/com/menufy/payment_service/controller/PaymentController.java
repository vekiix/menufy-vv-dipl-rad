package com.menufy.payment_service.controller;

import com.menufy.payment_service.dto.PaymentRequest;
import com.menufy.payment_service.dto.PaymentResponse;
import com.menufy.payment_service.models.Payment;
import com.menufy.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping()
    public ResponseEntity<PaymentResponse> createPaymentTransaction(@RequestBody PaymentRequest req) {
        return ResponseEntity.ok(new PaymentResponse(paymentService.createPaymentTransaction(req)));
    }

}
