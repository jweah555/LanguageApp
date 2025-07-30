package com.language.LanguageApp.Card;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.language.LanguageApp.Deck.Deck;
import com.language.LanguageApp.Users.Users;

import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;

@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cardId;
    
    @Column(nullable = false)
    private String language;

    @Column(nullable = true)
    private String status;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String translation;


    //Link to connect cards to user
    @ManyToMany(mappedBy = "cards")
    @JsonIgnoreProperties("cards") 
    private List<Users> users;

    //Link to connect cards to deck
    @ManyToMany(mappedBy = "cards")
    @JsonIgnoreProperties("cards") 
    private List<Deck> decks;

    public Card() {     
    }

    public Card(Long cardId, String language, String status, String description, String translation, List<Deck> decks, List<Users> users) {
        this.cardId = cardId;
        this.language = language;
        this.status = status;
        this.description = description;
        this.translation = translation;
        this.decks = decks;
        this.users = users;
    }

    public Card(String language, String status, String description, String translation, List<Deck> decks, List<Users> users) {
        this.language = language;
        this.status = status;
        this.description = description;
        this.translation = translation;
        this.decks = decks;
        this.users = users;
    }

    public Long getCardId() {
        return this.cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }


    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getStatus() {
        return this.status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTranslation() {
        return this.translation;
    }

    public void setTranslation(String translation) {
        this.translation = translation;
    }

    public List<Deck> getDecks() {
        return this.decks;
    }

    public void setDeck(List<Deck> decks) {
        this.decks = decks;
    }

    public List<Users> getUser() {
        return this.users;
    }

    public void setUsers(List<Users> users) {
        this.users = users;
    }

}
