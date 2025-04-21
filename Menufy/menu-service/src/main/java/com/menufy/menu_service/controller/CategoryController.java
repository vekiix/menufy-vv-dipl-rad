package com.menufy.menu_service.controller;

import com.menufy.menu_service.dto.CategoryRequest;
import com.menufy.menu_service.dto.CategoriesResponse;
import com.menufy.menu_service.dto.CategoryResponse;
import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoriesResponse> createCategory(@RequestBody CategoryRequest categoryRequest){
        return new ResponseEntity<>(new CategoriesResponse(categoryService.addCategory(categoryRequest)),HttpStatus.CREATED);
    }

    @PutMapping
    public ResponseEntity<CategoryResponse> updateCategory(@RequestParam String category, @RequestBody CategoryRequest categoryRequest){
        return new ResponseEntity<>(new CategoryResponse(categoryService.updateCategory(category, categoryRequest)),HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<CategoriesResponse> getAllCategories(){
        return new ResponseEntity<>(new CategoriesResponse(categoryService.findAllCategories()),HttpStatus.CREATED);
    }

    @DeleteMapping
    public ResponseEntity<CategoriesResponse> DeleteCategory(@RequestParam String id){
        return new ResponseEntity<>(new CategoriesResponse(categoryService.deleteCategory(id)),HttpStatus.OK);
    }

    @GetMapping("/add")
    public ResponseEntity<Category> addItemToCategory(@RequestParam String category, @RequestParam String item){
        return new ResponseEntity<>(categoryService.addItemToCategory(item, category), HttpStatus.CREATED);
    }

    @GetMapping("/remove")
    public ResponseEntity<Category> removeItemFromCategory(@RequestParam String category, @RequestParam String item){
        return new ResponseEntity<>(categoryService.removeItemFromCategory(item, category), HttpStatus.CREATED);
    }
}

