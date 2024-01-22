package com.gritlabstudent.user.ms.services;

import com.gritlabstudent.user.ms.models.User;
import com.gritlabstudent.user.ms.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class UserInfoDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userOptional = userRepository.findByName(username);
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + username);
        }
        User user = userOptional.get();

        // Initialize authorities
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().toString()));

        // Return Spring Security User object
        return new org.springframework.security.core.userdetails.User(user.getName(), user.getPassword(),
                authorities);
    }
}
