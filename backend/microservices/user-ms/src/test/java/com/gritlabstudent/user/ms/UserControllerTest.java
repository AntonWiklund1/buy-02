package com.gritlabstudent.user.ms;

import com.gritlabstudent.user.ms.controller.UserController;
import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.models.UserDTO;
import com.gritlabstudent.user.ms.services.UserService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;

@RunWith(SpringRunner.class)
public class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Before
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    public void test_CreateUser_ReturnsCreated() throws Exception {
        // Given
        UserDTO userDTO = new UserDTO("1", "John Doe", "ROLE_CLIENT", "avatar.jpg", BigDecimal.ONE);
        when(userService.createUser(any(User.class))).thenReturn(userDTO);

        User inputUser = new User();
        inputUser.setName("John Doe");
        inputUser.setEmail("john.doe@example.com");
        inputUser.setPassword("password");
        inputUser.setRole("ROLE_CLIENT");

        ObjectMapper objectMapper = new ObjectMapper();
        String userJson = objectMapper.writeValueAsString(inputUser);

        // When & Then
        mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(userJson))
                .andExpect(status().isCreated());
    }
}
