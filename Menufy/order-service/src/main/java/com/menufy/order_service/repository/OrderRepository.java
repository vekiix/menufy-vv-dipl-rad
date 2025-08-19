package com.menufy.order_service.repository;

import com.menufy.order_service.dto.OrderStatus;
import com.menufy.order_service.models.Order;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {

    @Query("{ 'status' : '?0', 'companyId' : '?1' }")
    List<Order> findByStatusAndCompanyId(@Param("status") OrderStatus status, @Param("companyId") String companyId);

    @Query("{ 'tableId' : '?0', 'status' : { $in: ?1 } }")
    List<Order> findByTableIdWithStatus(@Param("tableId")String tableId, List<String> statuses);
}
