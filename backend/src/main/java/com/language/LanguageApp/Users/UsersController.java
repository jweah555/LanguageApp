package com.language.LanguageApp.Users;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.deepl.api.DeepLClient;
import com.deepl.api.TextResult;
import com.language.LanguageApp.ResourceNotFoundException;

import ch.qos.logback.core.model.Model;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class UsersController {
    private final UsersRepository usersRepository;
    private final UsersService usersService;


    @Autowired
    public UsersController(UsersRepository usersRepository, UsersService usersService) {
        this.usersRepository = usersRepository;
        this.usersService = usersService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<Users>> getAllUsers() {
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

    @GetMapping("/{userName}")
    public Users getUserByUserName(@PathVariable String userName) {
        return usersService.getUsersByUserName(userName);
    }

    @PutMapping("users/{userId}")
    public ResponseEntity<Users> updateUserById(@PathVariable("userId") Long userId, @RequestBody Users updatedUser) {
        Users user = usersService.getUsersById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setFirstName(updatedUser.getFirstName());
        user.setLanguage(updatedUser.getLanguage());
        user.setRole(updatedUser.getRole());

        usersService.updateUsers(userId, updatedUser);

        return ResponseEntity.ok(user);
    }

    // @PostMapping("/register")
    // public ResponseEntity<Users> registerUser(@RequestBody Users users) {
    // Users newUser = usersRepository.save(users);

    // return ResponseEntity.status(HttpStatus.CREATED).body(newUser);

    // }

}
