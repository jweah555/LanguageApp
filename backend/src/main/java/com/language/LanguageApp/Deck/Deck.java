package com.language.LanguageApp.Deck;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "deck")
public class Deck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "deck_id")
    private Long deckId;

    @Column(name = "language",nullable = true)
    private String language;

    @Column(name = "name",nullable = true)
    private String description;

    //True for the deck auto-created for a user to hold cards they like, outside of any custom deck
    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    //Used to connect decks to user
    @ManyToMany(mappedBy = "decks")
    @JsonIgnoreProperties("decks")
    private Set<Users> users = new HashSet<>();

    //Link to connect decks to cards
    @ManyToMany
    @JoinTable(name = "deck_cards", joinColumns = @JoinColumn(name = "deck_id"), inverseJoinColumns = @JoinColumn(name = "card_id"))
    @JsonIgnoreProperties("decks")
    private Set<Card> cards = new HashSet<>();


    public Deck() {
    }

    public Deck(Long deckId, String language, String description, Set<Card> cards, Set<Users> users) {
        this.deckId = deckId;
        this.language = language;
        this.description = description;
        this.cards = cards;
        this.users = users;
    }

    public Deck(String language, String description, Set<Card> cards, Set<Users> users) {
        this.language = language;
        this.description = description;
        this.cards = cards;
        this.users = users;
    }

    public Long getDeckId() {
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

    public boolean isDefault() {
        return this.isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    public Set<Card> getCards() {
        return this.cards;
    }

    public void setCards(Set<Card> cards) {
        this.cards = cards;
    }

    public void addCard(Card card) {
        this.cards.add(card);
        card.getDecks().add(this);
    }

    public void removeCard(Card card) {
        this.cards.remove(card);
        card.getDecks().remove(this);
    }

    public Set<Users> getUsers() {
        return this.users;
    }

    public void setUsers(Set<Users> users) {
        this.users = users;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Deck deck = (Deck) o;
        return deckId != null && deckId.equals(deck.deckId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
