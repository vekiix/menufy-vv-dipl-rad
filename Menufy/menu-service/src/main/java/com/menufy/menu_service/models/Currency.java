package com.menufy.menu_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Document(collection = "currencies") // Marks this class as a MongoDB document
public class Currency {

    @Id
    private String currencyCode;

    private String name;

    private String symbol;
}
