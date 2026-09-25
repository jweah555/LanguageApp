package com.language.LanguageApp.Users;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.language.LanguageApp.ResourceNotFoundException;
import com.language.LanguageApp.BadRequestException;
import com.language.LanguageApp.UnauthorizedException;
import com.language.LanguageApp.Deck.Deck;
import com.language.LanguageApp.Deck.DeckRepository;

@Service
public class UsersService {
    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private DeckRepository deckRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Users> getAllUsers() {
        List<Users> users = usersRepository.findAll();
        if (users.isEmpty()) {
            throw new ResourceNotFoundException("No users found");
        }
        return users;
    }

    public Users getUsersById(@PathVariable long userId) {
        return usersRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public Users getUsersByUserName(String userName) {
        return usersRepository.getUsersByUserName(userName)
                .orElseThrow(() -> new ResourceNotFoundException(("No user found with this username")));

    }

    public Users getUserByPassword(String password) {
        return usersRepository.getUsersByPassword(password);
    }

    public Users getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()
                || authentication instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Not signed in");
        }
        return getUsersByUserName(authentication.getName());
    }

    public List<Users> getUsersByLanguage(String language) {
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
        users.setPassword(passwordEncoder.encode(users.getPassword()));
        Users newUser = usersRepository.save(users);

        Deck personalDeck = new Deck();
        personalDeck.setLanguage(newUser.getLanguage());
        personalDeck.setDeckName("Liked Cards");
        personalDeck.setDescription("Liked Cards");
        personalDeck.setDefault(true);
        personalDeck.setOwner(newUser);
        Deck savedPersonalDeck = deckRepository.save(personalDeck);

        newUser.getDecks().add(savedPersonalDeck);

        return newUser;
    }

    public Users updateUsers(Long userId, Users updatedUserData) {
        Users existingUser = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with ID " + userId + " not found"));
        existingUser.setFirstName(updatedUserData.getFirstName());
        existingUser.setLastName(updatedUserData.getLastName());
        existingUser.setRole(updatedUserData.getRole());
        existingUser.setLanguage(updatedUserData.getLanguage());

        return usersRepository.save(existingUser);

    }

    public void deleteUsers(Long usersId) {
        if (!usersRepository.existsById(usersId)) {
            throw new ResourceNotFoundException("Users with Id " + usersId + " not found");
        }
        usersRepository.deleteById(usersId);
    }

}
