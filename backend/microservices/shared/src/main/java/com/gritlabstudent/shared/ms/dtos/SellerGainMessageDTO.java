package com.gritlabstudent.shared.ms.dtos;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SellerGainMessageDTO {

    private String userId;
    private BigDecimal gain;

    public SellerGainMessageDTO(String sellerId, BigDecimal gain) {
        this.userId = sellerId;
        this.gain = gain;
    }
}

