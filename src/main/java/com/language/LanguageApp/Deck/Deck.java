package com.language.LanguageApp.Deck;

import java.util.List;

import com.language.LanguageApp.Card.Card;
import com.language.LanguageApp.Users.Users;

import jakarta.annotation.Generated;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="deck")
public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long deckId;
    
    @Column(nullable= true)
    private String language;

    @Column(nullable = true)
    private String description;

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Card> cards;

    // @Column(nullable = true)
    @ManyToOne
    @JoinColumn(name = "users_id")
    private Users users;
    
    public Deck() {
    }

    public Deck(Long deckId, String language, String description, List<Card> cards, Users users) {
        this.deckId = deckId;
        this.language = language;
        this.description = description;
        this.cards = cards;
        this.users = users;
    }

    public Deck(String language, String description, List<Card> cards, Users users) {
        this.language = language;
        this.description = description;
        this.cards = cards;
        this.users = users;
    }

    public Long getdeckId() {
        return this.deckId;
    }

    public void setDeckId(Long deckId) {
        this.deckId = deckId;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Card> getCards() {
        return this.cards;
    }

    public void setCards(List<Card> cards) {
        this.cards = cards;
    }

    public Users getUsers() {
        return this.users;
    }

    public void setUsers(Users users) {
        this.users = users;
    }



}
