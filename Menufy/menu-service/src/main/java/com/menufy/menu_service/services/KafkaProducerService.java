package com.menufy.menu_service.services;

import com.menufy.menu_service.dto.DataAction;
import com.menufy.menu_service.dto.ItemChangeDto;
import com.menufy.menu_service.models.Item;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {
    @Value("${menu-service.kafka.item-topic}")
    private String ITEM_TOPIC;

    private final KafkaTemplate<String, String> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendItem(DataAction _operation, Item _item) {
        kafkaTemplate.send(ITEM_TOPIC, new ItemChangeDto(_operation, _item).toString());
    }
}
