package com.menufy.order_service.repository;

import com.menufy.order_service.dto.OrderStatus;
import com.menufy.order_service.models.Order;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    @Query("{ 'status' : '?0', 'companyId' : '?1' }")
    List<Order> findByStatusAndCompanyId(@Param("status") OrderStatus status, @Param("companyId") String companyId);

    @Aggregation(pipeline = {
            "{ '$match': { 'status': 'IN_PROGRESS'} }",
            "{ '$group': { '_id': '$tableId', 'orders': { '$push': '$$ROOT' } } }"
    })
    List<Object> findByStatusCategorisedByTableId(@Param("statuses") List<OrderStatus> statuses,
                                                 @Param("companyId") String companyId);
}
