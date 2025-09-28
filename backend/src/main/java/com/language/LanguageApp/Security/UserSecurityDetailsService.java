package com.language.LanguageApp.Security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.language.LanguageApp.Users.Users;
import com.language.LanguageApp.Users.UsersRepository;

@Service
public class UserSecurityDetailsService implements UserDetailsService {

    @Autowired
    private UsersRepository repo;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {

        Users users = repo.getUsersByUserName(userName)
                .orElseThrow(() -> new UsernameNotFoundException(userName + "not found"));
        ArrayList<SimpleGrantedAuthority> authList = new ArrayList<>();
        authList.add(new SimpleGrantedAuthority(users.getRole()));
        return new org.springframework.security.core.userdetails.User(users.getUserName(), users.getPassword(),
                authList);

    }

}
