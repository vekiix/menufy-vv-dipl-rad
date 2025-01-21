package com.menufy.menu_service.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class Currency {
    @Id
    @Column(nullable = false)
    private String currencyCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String symbol;
}
