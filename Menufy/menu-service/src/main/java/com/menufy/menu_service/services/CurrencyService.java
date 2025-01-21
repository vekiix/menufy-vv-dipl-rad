package com.menufy.menu_service.services;

import com.menufy.menu_service.models.Currency;
import com.menufy.menu_service.repository.CurrencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CurrencyService {
    private final CurrencyRepository currencyRepository;

    public Currency getCurrencyByCurrencyCode(String currencyCode) throws Exception{
        Currency currency = currencyRepository.findByCurrencyCode(currencyCode);
        if(currency == null)
        {
            throw new Exception(String.format("Currency with code '%s' doesn't exist", currencyCode));
        }
        return currency;
    }
}
