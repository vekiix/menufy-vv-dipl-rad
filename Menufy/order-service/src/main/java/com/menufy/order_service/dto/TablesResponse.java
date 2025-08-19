package com.menufy.order_service.dto;

import com.menufy.order_service.models.Table;

import java.util.List;

public record TablesResponse(List<Table> tables) {
}
