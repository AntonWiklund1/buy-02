package com.gritlabstudent.order.ms.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.gritlabstudent.order.ms.models.AmountDTO;

import java.math.BigDecimal;

@Service
public class UserServiceImpl implements UserService {

    private final RestTemplate restTemplate;
    private final String userMsBaseUrl;

    public UserServiceImpl(RestTemplateBuilder restTemplateBuilder, @Value("${userms.baseurl}") String userMsBaseUrl) {
        this.restTemplate = restTemplateBuilder.build();
        this.userMsBaseUrl = userMsBaseUrl;
    }

    @Override
    public void updateUserTotalAmount(String userId, BigDecimal amount) {
        AmountDTO amountDTO = new AmountDTO(amount);
        HttpEntity<AmountDTO> request = new HttpEntity<>(amountDTO);
        restTemplate.postForObject(userMsBaseUrl + "/users/" + userId + "/updateTotalAmount", request, String.class);
    }
}
