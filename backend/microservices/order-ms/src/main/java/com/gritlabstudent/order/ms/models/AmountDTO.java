package com.gritlabstudent.order.ms.models;

import lombok.Getter;

import java.math.BigDecimal;

@Getter
public class AmountDTO {
    private BigDecimal amount;


    public AmountDTO(BigDecimal amount) {
        this.amount = amount;
    }

}