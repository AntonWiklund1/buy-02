package com.gritlabstudent.order.ms.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;

@Document(collection = "orders")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Order {
    @Id
    private String id;
    private String userId;
    private List<String> productIds;
    private Date createdAt;
    private Date updatedAt;
    private Boolean isPaid;
    private Boolean isDelivered;
    private Status status;

}