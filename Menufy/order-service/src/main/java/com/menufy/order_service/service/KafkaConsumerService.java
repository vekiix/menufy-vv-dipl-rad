package com.menufy.order_service.service;

import com.menufy.order_service.controller.OrderWSController;
import com.menufy.order_service.dto.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.menufy.order_service.models.Order;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class KafkaConsumerService {

    @Value("${order-service.kafka.company-topic}")
    private final String companyTopic = "company";

    @Value("${order-service.kafka.item-topic}")
    private final String itemTopic = "item";

    @Value("${order-service.kafka.table-topic}")
    private final String tableTopic = "table";

    @Value("${order-service.kafka.payment-topic}")
    private final String paymentTopic = "payment";

    private final OrderWSController orderWSController;
    private final CompanyService companyService;
    private final OrderService orderService;
    private final ItemService itemService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = {"${order-service.kafka.company-topic}",
                                "${order-service.kafka.item-topic}",
                                "${order-service.kafka.table-topic}",
                                "${order-service.kafka.payment-topic}"}, groupId = "order_service_group")
    public void listen(String value,
                       @Header(KafkaHeaders.RECEIVED_TOPIC) String topic) {
        try {
            if(topic.equals(companyTopic)){
                CompanyChangeDto dto = objectMapper.readValue(objectMapper.readValue(value, String.class), CompanyChangeDto.class);
                switch (dto.operation)
                {
                    case DataAction.CREATE, DataAction.UPDATE -> companyService.createOrUpdateCompany(dto.company);
                    case DataAction.DELETE -> companyService.deleteCompany(dto.company);
                }
            }
            else if(topic.equals(itemTopic)){
                ItemChangeDto dto = objectMapper.readValue(objectMapper.readValue(value, String.class), ItemChangeDto.class);
                switch (dto.operation)
                {
                    case DataAction.CREATE, DataAction.UPDATE -> itemService.createOrUpdate(dto.item);
                    case DataAction.DELETE -> itemService.deleteItem(dto.item);
                }
            }
            else if(topic.equals(tableTopic)){
                TableChangeDto dto = objectMapper.readValue(objectMapper.readValue(value, String.class), TableChangeDto.class);
                switch (dto.operation) {
                    case DataAction.CREATE, DataAction.UPDATE -> companyService.createOrUpdateCompanyTable(dto.table);
                    case DataAction.DELETE -> companyService.deleteCompanyTable(dto.table);
                }
            }
            else if(topic.equals(paymentTopic)){
                PaymentDto dto = objectMapper.readValue(value, PaymentDto.class);
                Order order = orderService.processPaymentDto(dto);
                if(dto.paymentStatus == PaymentStatus.ACCEPTED){
                    orderWSController.sendOrderChangeEvent(new OrderChangeEventArgs(order.getId(), order.getCompanyId(), order.getStatus()));
                }
            }
            System.out.println(String.format("Consumed event from topic '%s': value = %s", topic, value));

        } catch (JsonProcessingException e) {
            e.printStackTrace();
            throw new RuntimeException("There was a problem with parsing company object from Kafka pipeline");
        }


    }


}
