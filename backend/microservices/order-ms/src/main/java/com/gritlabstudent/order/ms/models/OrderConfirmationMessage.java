package com.gritlabstudent.order.ms.models;


import lombok.Data;

@Data
public class OrderConfirmationMessage {
    private String orderId;
    private String status;

    public OrderConfirmationMessage(String orderId, String confirmed) {
        this.orderId = orderId;
        this.status = confirmed;
    }
}