package com.gritlabstudent.media.ms.models;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class SimpleUserDetails implements UserDetails {

    private final String username;
    private final Collection<? extends GrantedAuthority> authorities;

    public SimpleUserDetails(String username, List<SimpleGrantedAuthority> authorities) {
        this.username = username;
        this.authorities = authorities; // Corrected this line
    }


    // Implement all the necessary methods from UserDetails interface.
    // For simplicity, we can return true for account status methods, but in a real application
    // these should reflect the actual user status.

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // JWT does not deal with password in this context
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
