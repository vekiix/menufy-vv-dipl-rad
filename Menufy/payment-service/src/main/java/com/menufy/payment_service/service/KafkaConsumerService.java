package com.menufy.payment_service.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.menufy.payment_service.dto.CompanyChangeDto;
import com.menufy.payment_service.dto.DataAction;
import com.menufy.payment_service.dto.OrderDto;
import com.menufy.payment_service.models.Payment;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class KafkaConsumerService {

    @Value("${payment-service.kafka.company-topic}")
    private final String companyTopic = "company";

    private final CompanyService companyService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = {"${payment-service.kafka.company-topic}"}, groupId = "payment-service-g")
    public void listen(String value,
                       @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            if(topic.equals(companyTopic)){
                CompanyChangeDto dto = objectMapper.readValue(objectMapper.readValue(value, String.class), CompanyChangeDto.class);
                switch (dto.operation)
                {
                    case DataAction.CREATE, DataAction.UPDATE -> companyService.createOrUpdateCompanyInfo(dto.company);
                    case DataAction.DELETE -> companyService.deleteCompany(dto.company);
                }
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("There was a problem with parsing company object from Kafka pipeline");
        }
    }
}
