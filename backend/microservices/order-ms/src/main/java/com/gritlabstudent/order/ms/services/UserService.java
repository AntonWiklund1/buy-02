package com.gritlabstudent.order.ms.services;

import java.math.BigDecimal;

public interface UserService {
    void updateUserTotalAmount(String userId, BigDecimal amount);
}