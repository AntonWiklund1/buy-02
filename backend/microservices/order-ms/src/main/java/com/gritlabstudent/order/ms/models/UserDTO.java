package com.gritlabstudent.order.ms.models;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserDTO {
    private String id;
    private BigDecimal totalAmountSpent;
}
