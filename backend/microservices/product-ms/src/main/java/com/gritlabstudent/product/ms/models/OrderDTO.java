package com.gritlabstudent.product.ms.models;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Data
public class OrderDTO {
    private String id;
    private String userId;
    private List<String> productIds;
    private Date createdAt;
    private Date updatedAt;
    private BigDecimal total;

}

