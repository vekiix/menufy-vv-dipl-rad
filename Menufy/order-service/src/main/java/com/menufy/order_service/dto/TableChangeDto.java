package com.menufy.order_service.dto;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.menufy.order_service.models.Table;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TableChangeDto {
    public DataAction operation;
    public TableDto table;

    public TableChangeDto(DataAction _operation, Table _table){
        this.operation = _operation;
        this.table = new TableDto(_table);
    }

    @Override
    public String toString()
    {
        ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
        try {
            return ((ObjectWriter) ow).writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem while parsing 'TableChangeDto' to string");
        }
    }
}
