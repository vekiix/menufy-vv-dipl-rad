package com.menufy.menu_service.repository;

import com.menufy.menu_service.models.Currency;
import org.springframework.data.repository.Repository;

public interface CurrencyRepository extends Repository<Currency,String> {
    Currency findByCurrencyCode (String currencyCode);
}
