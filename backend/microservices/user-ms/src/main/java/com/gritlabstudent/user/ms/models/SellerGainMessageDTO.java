package com.gritlabstudent.user.ms.models;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SellerGainMessageDTO {

    private String userId;
    private BigDecimal gain;

}