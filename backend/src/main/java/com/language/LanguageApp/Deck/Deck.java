package com.language.LanguageApp.Deck;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.language.LanguageApp.Card.Card;
import com.language.LanguageApp.Users.Users;

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

    //Owning user; a deck always belongs to exactly one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties("decks")
    private Users owner;

    //Cards in this deck; a card always belongs to exactly one deck
    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("deck")
    private Set<Card> cards = new HashSet<>();


    public Deck() {
    }

    public Deck(Long deckId, String language, String description, Set<Card> cards, Users owner) {
        this.deckId = deckId;
        this.language = language;
        this.description = description;
        this.cards = cards;
        this.owner = owner;
    }

    public Deck(String language, String description, Set<Card> cards, Users owner) {
        this.language = language;
        this.description = description;
        this.cards = cards;
        this.owner = owner;
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
        card.setDeck(this);
    }

    public void removeCard(Card card) {
        this.cards.remove(card);
        card.setDeck(null);
    }

    public Users getOwner() {
        return this.owner;
    }

    public void setOwner(Users owner) {
        this.owner = owner;
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
