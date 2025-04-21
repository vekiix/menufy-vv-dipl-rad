package com.menufy.auth_service.service;

import com.menufy.auth_service.dto.CompanyChangeDto;
import com.menufy.auth_service.dto.DataAction;
import com.menufy.auth_service.dto.TableChangeDto;
import com.menufy.auth_service.models.Company;
import com.menufy.auth_service.models.CompanyTable;
import jakarta.persistence.Table;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    @Value("${auth-service.kafka.company-topic}")
    private String COMPANY_TOPIC;

    @Value("${auth-service.kafka.table-topic}")
    private String TABLE_TOPIC;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendCompanyChange(DataAction _action, Company _company)
    {
        kafkaTemplate.send(COMPANY_TOPIC, new CompanyChangeDto(_action, _company).toString());
    }

    public void sendTableChange(DataAction _action, CompanyTable _table) {
        kafkaTemplate.send(TABLE_TOPIC, new TableChangeDto(_action, _table).toString());
    }
}
