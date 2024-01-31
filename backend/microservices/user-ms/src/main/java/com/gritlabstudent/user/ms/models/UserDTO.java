package com.gritlabstudent.user.ms.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String name;
    private String role;
    private String avatarImagePath;
    private BigDecimal totalAmountSpent;
    private BigDecimal totalAmountGained;
    private List<String> favoriteProducts;
}
