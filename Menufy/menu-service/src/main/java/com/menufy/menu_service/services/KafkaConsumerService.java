package com.menufy.menu_service.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.menufy.menu_service.dto.CompanyChangeDto;
import com.menufy.menu_service.dto.DataAction;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.stereotype.Service;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.kafka.annotation.KafkaListener;

@Service
@AllArgsConstructor
public class KafkaConsumerService {

    @Value("${menu-service.kafka.company-topic}")
    private static final String COMPANY_TOPIC = "company";

    private final CompanyService companyService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = COMPANY_TOPIC, groupId = "my-consumer-group")
    public void listen(String value,
                       @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            switch (topic)
            {
                case COMPANY_TOPIC -> {
                    System.out.println(String.format("Consumed event from topic '%s': value = %s", topic, value));
                    CompanyChangeDto dto = objectMapper.readValue(objectMapper.readValue(value, String.class), CompanyChangeDto.class);
                    switch (dto.operation)
                    {
                        case DataAction.CREATE -> companyService.createOrUpdate(dto.company);
                        case DataAction.UPDATE -> companyService.createOrUpdate(dto.company);
                        case DataAction.DELETE -> companyService.deleteCompany(dto.company);
                    }
                }
            }

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem with parsing company object from Kafka pipeline");
        }


    }


}
