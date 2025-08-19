package com.menufy.payment_service.controller;

import com.menufy.payment_service.dto.*;
import com.menufy.payment_service.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment/parameters")
@RequiredArgsConstructor
public class PaymentInfoController {
    @Autowired
    private final CompanyService companyService;

    @GetMapping()
    public ResponseEntity<CompanyResponse> getCompanyInfo(){
        return ResponseEntity.ok(new CompanyResponse(companyService.getCompanyInfo()));
    }

    @GetMapping(value = "/validate", params = "paymentType=KEKS_PAY")
    public ResponseEntity<CompanyResponse> validateKeksPayInfo()
    {
        return ResponseEntity.ok(new CompanyResponse(companyService.validateKeksPayParams()));
    }

    @GetMapping(value = "/validate", params = "paymentType=WS_PAY")
    public ResponseEntity<CompanyResponse> validateWSPayInfo()
    {
        return ResponseEntity.ok(new CompanyResponse(companyService.validateWSPayParams()));
    }

    @PostMapping("/kpay")
    public ResponseEntity<CompanyResponse> createOrUpdateKeksPayInfo(@RequestBody KeksPayParamsRequest req) {
        return ResponseEntity.ok(new CompanyResponse(companyService.updateCompanyKeksPayParameters(req)));
    }

    @PostMapping("/wspay")
    public ResponseEntity<CompanyResponse> createOrUpdateWSPayInfo(@RequestBody WSPayParamsRequest req) {
        return ResponseEntity.ok(new CompanyResponse(companyService.updateCompanyWSPayParameters(req)));
    }
}
