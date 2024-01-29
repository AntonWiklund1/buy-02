package com.gritlabstudent.user.ms.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String name;
    private String role;
    private String avatarImagePath;
    private BigDecimal totalAmountSpent;
}
