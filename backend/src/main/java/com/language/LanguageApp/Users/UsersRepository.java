package com.language.LanguageApp.Users;

import java.util.List;
import java.util.Optional;

import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.support.JpaRepositoryFactory;
import org.springframework.stereotype.Repository;

@Repository
public interface UsersRepository extends JpaRepository<Users, Long> {
    List<Users> findByLanguage(String language);

    List<Users> findByFirstName(String firstName);

    Optional<Users> getUsersByUserName(String userName);

    Users getUsersByPassword(String password);

    // Users findByUserName(String userName);

}
