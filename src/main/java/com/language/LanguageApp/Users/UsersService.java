package com.language.LanguageApp.Users;

import java.util.List;

import org.apache.catalina.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.language.LanguageApp.ResourceNotFoundException;
import com.language.LanguageApp.BadRequestException;


@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    
    public List<Users> getUsers() {
        List<Users> users = usersRepository.findAll();
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users;
    }

    
    public Users getUsersById(@PathVariable long userId){
        return usersRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    
    public List<Users> getUsersByLanguage(String language ) {
        List<Users> users = usersRepository.findByLanguage(language);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found with language");
        }
        return users;
    }

    
    public List<Users> getUsersByFirstName(String firstName) {
        List<Users> users = usersRepository.findByFirstName(firstName);
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found with first name: " + firstName);
        }
        return users;
    }

    
    public Users addUser(Users users) {
        if (users == null) {
            throw new BadRequestException("User object must not be null");
        }
        return usersRepository.save(users);
    }

   
    public Users updateUsers(Long userId, Users updatedUserData) {
        Users existingUser = usersRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found"));
        existingUser.setFirstName(updatedUserData.getFirstName());
        existingUser.setLastName(updatedUserData.getLastName());
        existingUser.setRole(updatedUserData.getRole());
        existingUser.setLanguage(updatedUserData.getLanguage());
        existingUser.setCards(updatedUserData.getCards());
        existingUser.setDeck(updatedUserData.getDecks());

        

        return usersRepository.save(existingUser);

    }
    

    public void deleteUsers(Long usersId) {
        if (!usersRepository.existsById(usersId)) {
            throw new ResourceNotFoundException("Users with Id " + usersId + " not found");
        }
        usersRepository.deleteById(usersId);
    }
    


}
