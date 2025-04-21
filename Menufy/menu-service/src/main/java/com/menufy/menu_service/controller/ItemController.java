package com.menufy.menu_service.controller;

import com.menufy.menu_service.dto.DataAction;
import com.menufy.menu_service.dto.ItemRequest;
import com.menufy.menu_service.dto.ItemResponse;
import com.menufy.menu_service.dto.ItemsResponse;
import com.menufy.menu_service.models.Item;
import com.menufy.menu_service.services.ItemService;
import com.menufy.menu_service.services.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.json.JSONParser;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
@RequiredArgsConstructor
public class ItemController {
    private final ItemService itemService;
    private final KafkaProducerService kafkaProducerService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ItemResponse> createProduct(@RequestBody ItemRequest itemRequest) {
        Item item = itemService.createItem(itemRequest);
        kafkaProducerService.sendItem(DataAction.CREATE, item);
        return new ResponseEntity<>(new ItemResponse(item), HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<ItemResponse> updateProduct(@RequestParam String itemId, @RequestBody ItemRequest itemRequest){
        Item item = itemService.updateItem(itemId, itemRequest);
        kafkaProducerService.sendItem(DataAction.UPDATE, item);
        return new ResponseEntity<>(new ItemResponse(item),HttpStatus.CREATED);
    }

    @PostMapping("/find")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ItemsResponse> findProducts(@RequestBody List<String> itemIds) {
        return new ResponseEntity<>(new ItemsResponse(itemService.findItemsFromIdList(itemIds)), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ItemResponse> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(new ItemResponse(itemService.findItemById(id)));
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<ItemsResponse> getAllProducts() {
        return ResponseEntity.ok(new ItemsResponse(itemService.getAllItems()));
    }

    @DeleteMapping
    public ResponseEntity<ItemsResponse> deleteProduct(@RequestParam String id){
        Item itemToDelete = itemService.findItemById(id);
        List<Item> itemsList = itemService.deleteItem(id);
        kafkaProducerService.sendItem(DataAction.DELETE, itemToDelete);
        return new ResponseEntity<>(new ItemsResponse(itemsList), HttpStatus.OK);
    }
}
