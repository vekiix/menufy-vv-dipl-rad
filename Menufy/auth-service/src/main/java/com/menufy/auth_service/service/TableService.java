package com.menufy.auth_service.service;

import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.models.Table;
import com.menufy.auth_service.repository.TableRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class TableService {
    private final TableRepository tableRepository;

    public Optional<Table> findTableByUID(String uid){
        return tableRepository.findById(uid);
    }
}
