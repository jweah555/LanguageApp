package com.language.LanguageApp.Users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.language.LanguageApp.ResourceNotFoundException;

import ch.qos.logback.core.model.Model;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
public class UsersController {
    @Autowired
    private UsersService usersService;

    @GetMapping("/users") 
    public ResponseEntity<List<Users>> getAllUsers(){
        List<Users> users = usersService.getAllUsers();

        return ResponseEntity.ok(users);
        
    }

    @PostMapping("/users")
    public ResponseEntity<Users> addUser(@RequestBody Users users) {
        Users createdUser = usersService.addUser(users);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser); 
    }

    @GetMapping("users/{userId}") 
    public ResponseEntity<Users> getUserById(@PathVariable("userId") Long userId) {
        Users user = usersService.getUsersById(userId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("users/language/{language}")
    public ResponseEntity<List<Users>> getUsersByLanguage(@PathVariable("language") String language) {
        List<Users> users = usersService.getUsersByLanguage(language);
        return ResponseEntity.ok(users);
    }

    @GetMapping("users/fristName/{firstName}")
    public ResponseEntity<List<Users>> getUsersByFirst(@PathVariable("firstName") String firstName) {
        List<Users> users = usersService.getUsersByFirstName(firstName);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("users/{userId}")
    public ResponseEntity<Void> deleteUserById(@PathVariable("userId") Long userId) {
        Users user = usersService.getUsersById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        usersService.deleteUsers(userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("users/{userId}")
    public ResponseEntity<Users> updateUserById(@PathVariable("userId") Long userId, @RequestBody Users updatedUser){
        Users user = usersService.getUsersById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setFirstName(updatedUser.getFirstName());
        user.setLanguage(updatedUser.getLanguage());
        user.setRole(updatedUser.getRole());
        user.setCards(updatedUser.getCards());
        user.setDeck(updatedUser.getDecks());

        usersService.updateUsers(userId, updatedUser);

        return ResponseEntity.ok(user);
    }  

}
