package com.language.LanguageApp.Users;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.language.LanguageApp.Card.Card;
import com.language.LanguageApp.Deck.Deck;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;



@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long usersId;

    @Column(name = "first_name",nullable = false)
    private String firstName;

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
    private List<Deck> decks;

    // Link to connect users to cards
    @ManyToMany
    @JoinTable(name = "user_cards", joinColumns = @JoinColumn(name = "users_id"), inverseJoinColumns = @JoinColumn(name = "card_id"))
    @JsonIgnoreProperties("users")
    private List<Card> cards; // Use plural for clarity

    public Users() {
    }

    public Users(Long usersId, String firstName, String lastName, String role, String language, List<Deck> decks,
            List<Card> cards) {
        this.usersId = usersId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
        this.cards = cards;
    }

    public Users(String firstName, String lastName, String role, String language, List<Deck> decks, List<Card> cards) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
        this.cards = cards;
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

    public void setDeck(List<Deck> decks) {
        this.decks = decks;
    }

    public List<Card> getCards() {
        return this.cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

}
