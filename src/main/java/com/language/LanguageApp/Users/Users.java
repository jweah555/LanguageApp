package com.language.LanguageApp.Users;

import java.util.List;

import com.language.LanguageApp.Card.Card;
import com.language.LanguageApp.Deck.Deck;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long usersId;

    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private String language;

    //One to many does not have an optional attribute
    @OneToMany(mappedBy = "users", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Deck> decks;

    public Users() {
    }

    public Users(Long usersId, String firstName, String lastName, String role, String language, List<Deck> decks) {
        this.usersId = usersId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
    }

    public Users(String firstName, String lastName, String role, String language, List<Deck> decks) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
    }

    public Long getUsersId() {
        return this.usersId;
    }

    public void setUsersId(Long usersId) {
        this.usersId = usersId;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<Deck> getDecks() {
        return this.decks;
    }

    public void setDecks(List<Deck> decks) {
        this.decks = decks;
    }
    
}
