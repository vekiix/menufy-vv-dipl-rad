package com.menufy.auth_service.controller;


import com.menufy.auth_service.dto.*;
import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.models.CompanyTable;
import com.menufy.auth_service.service.KafkaProducerService;
import com.menufy.auth_service.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/table")
@RequiredArgsConstructor
public class TableController {
    private final KafkaProducerService kafkaProducerService;
    private final TableService tableService;

    @GetMapping()
    public ResponseEntity<TablesResponse> getAllCompanyTables (){
        return ResponseEntity.ok(new TablesResponse(tableService.getAllCompanyTables()));
    }

    @PostMapping()
    public ResponseEntity<TableResponse> createTable(@RequestBody TableRequest tableRequest){
        CompanyTable createdTable = tableService.createNewTable(tableRequest);
        kafkaProducerService.sendTableChange(DataAction.CREATE, createdTable);
        return ResponseEntity.ok(new TableResponse(createdTable));
    }

    @PutMapping()
    public ResponseEntity<TableResponse> updateTable(@RequestBody TableRequest tableRequest, @RequestParam String table){
        CompanyTable updatedTable = tableService.updateCompanyTable(table, tableRequest);
        kafkaProducerService.sendTableChange(DataAction.UPDATE, updatedTable);
        return ResponseEntity.ok(new TableResponse(updatedTable));
    }

    @DeleteMapping()
    public ResponseEntity<TablesResponse> deleteCompanyTable (@RequestParam String table){
        CompanyTable deleteTable = tableService.findTableByUID(table);
        List<CompanyTable> tables = tableService.deleteTable(table);
        kafkaProducerService.sendTableChange(DataAction.DELETE,deleteTable);
        return ResponseEntity.ok(new TablesResponse(tables));
    }
}
