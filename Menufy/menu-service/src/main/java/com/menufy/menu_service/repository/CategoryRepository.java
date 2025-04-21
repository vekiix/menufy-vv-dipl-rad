package com.menufy.menu_service.repository;

import com.menufy.menu_service.models.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;


public interface CategoryRepository extends MongoRepository<Category, String> {
    @Query("{ 'company.id': ?0 }")
    List<Category> findByCompanyId(String companyId);
}
