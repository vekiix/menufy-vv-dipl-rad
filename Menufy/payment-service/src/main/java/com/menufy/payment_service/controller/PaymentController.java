package com.menufy.payment_service.controller;

import com.menufy.payment_service.dto.*;
import com.menufy.payment_service.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping("/{payment}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<PaymentResponse> getPaymentTransaction(@PathVariable String payment){
        return ResponseEntity.ok(new PaymentResponse(paymentService.findPaymentById(payment)));
    }

    @PostMapping()
    @ResponseStatus(HttpStatus.OK)
    public void createPaymentTransaction(@RequestBody OrderDto order) {
        paymentService.createPaymentTransaction(order);
    }

    @PostMapping(value = "/{id}", params = "paymentType=KEKS_PAY")
    public ResponseEntity<PaymentResponse> payForOrder(@PathVariable String id,
                                                       @RequestParam PaymentType paymentType,
                                                       @RequestBody KeksPayPaymentDetails paymentDetails) {
        return ResponseEntity.ok(new PaymentResponse(paymentService.processKeksPayPayment(id, paymentDetails)));
    }

    @PostMapping(value = "/{id}", params = "paymentType=WS_PAY")
    public ResponseEntity<PaymentResponse> payForOrder(@PathVariable String id,
                                                       @RequestParam PaymentType paymentType,
                                                       @RequestBody  WSPayPaymentDetails paymentDetails) {
        return ResponseEntity.ok(new PaymentResponse(paymentService.processWSPayPayment(id, paymentDetails)));
    }


}
