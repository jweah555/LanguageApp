package com.language.LanguageApp.Users;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.language.LanguageApp.Deck.Deck;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long usersId;

    @Column(name = "first_name",nullable = false)
    private String firstName;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "password",nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "role", nullable = false)
    private String role;
    
    @Column(name = "language",nullable = false)
    private String language;

    // Link to connect users to decks
    @ManyToMany
    @JoinTable(name = "users_decks", joinColumns = @JoinColumn(name = "users_id"), inverseJoinColumns = @JoinColumn(name = "deck_id"))
    @JsonIgnoreProperties("users") // Prevents recursion during JSON serialization
    private Set<Deck> decks = new HashSet<>();

    public Users() {
    }

    public Users(Long usersId, String firstName, String lastName, String role, String language, Set<Deck> decks) {
        this.usersId = usersId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
    }

    public Users(String firstName, String lastName, String role, String language, Set<Deck> decks) {
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

    public Set<Deck> getDecks() {
        return this.decks;
    }

    public void setDeck(Set<Deck> decks) {
        this.decks = decks;
    }

    public void addDeck(Deck deck) {
        this.decks.add(deck);
        deck.getUsers().add(this);
    }

    public void removeDeck(Deck deck) {
        this.decks.remove(deck);
        deck.getUsers().remove(this);
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Users users = (Users) o;
        return usersId != null && usersId.equals(users.usersId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
