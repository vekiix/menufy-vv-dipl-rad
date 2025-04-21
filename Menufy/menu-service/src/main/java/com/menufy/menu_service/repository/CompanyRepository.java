package com.menufy.menu_service.repository;

import com.menufy.menu_service.models.Category;
import com.menufy.menu_service.models.Company;
import com.menufy.menu_service.models.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface CompanyRepository extends MongoRepository<Company, String> {
    @Query(value = "{ 'categories._id': ?0 }", fields = "{ 'categories.$': 1 }")
    Optional<Category> findCategoryByCategoryId(String categoryId);
}
