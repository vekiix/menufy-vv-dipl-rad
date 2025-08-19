package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.TableRequest;
import com.menufy.auth_service.dto.UserClaims;
import com.menufy.auth_service.exceptions.MissingTableException;
import com.menufy.auth_service.exceptions.TableUIDTakenException;
import com.menufy.auth_service.models.CompanyTable;
import com.menufy.auth_service.repository.TableRepository;
import com.menufy.auth_service.utils.Messages;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TableService {
    private final TableRepository tableRepository;
    private final CompanyService companyService;


    public CompanyTable findTableByUID(String uid){
        Optional<CompanyTable> tableOpt = tableRepository.findById(uid);
        if(tableOpt.isPresent()){
            return tableOpt.get();
        }
        throw new MissingTableException();
    }

    public List<CompanyTable> getAllTables() {
        return  tableRepository.findAll();
    }

    public List<CompanyTable> getAllCompanyTables() {
        UserClaims claims = (UserClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return tableRepository.findByCompanyId(claims.getCompanyId());
    }

    public CompanyTable createNewTable(TableRequest tableRequest) {
        if(tableRepository.existsById(tableRequest.uid())){
            throw new TableUIDTakenException();
        }

        UserClaims claims = (UserClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        CompanyTable table = new CompanyTable();
        table.setTableName(tableRequest.tableName());
        table.setUid(tableRequest.uid());
        table.setCompany(companyService.getCompanyById(claims.getCompanyId()));
        return tableRepository.save(table);
    }

    public CompanyTable updateCompanyTable(String tableId, TableRequest tableRequest){
        CompanyTable table = this.findTableByUID(tableId);
        //table.setUid(tableRequest.uid());
        table.setTableName(tableRequest.tableName());
        return tableRepository.save(table);
    }

    public List<CompanyTable> deleteTable(String tableId) {
        CompanyTable compTable = this.findTableByUID(tableId);
        UserClaims claims = (UserClaims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(compTable.getCompany().getId().equals(claims.getCompanyId())){
            tableRepository.delete(compTable);
            return this.getAllCompanyTables();
        }
        throw new IllegalArgumentException(Messages.ACCESS_NOT_ALLOWED);
    }

    public void save(CompanyTable table) {
        tableRepository.save(table);
    }
}
