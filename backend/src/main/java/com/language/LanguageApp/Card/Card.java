package com.language.LanguageApp.Card;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.language.LanguageApp.Deck.Deck;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Long cardId;

    @Column(name = "language",nullable = false)
    private String language;

    @Column(name = "status",nullable = true)
    private String status;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "translation", nullable = false)
    private String translation;


    //Deck this card belongs to; a card always belongs to exactly one deck
    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    @JsonIgnoreProperties("cards")
    private Deck deck;

    public Card() {
    }

    public Card(Long cardId, String language, String status, String description, String translation, Deck deck) {
        this.cardId = cardId;
        this.language = language;
        this.status = status;
        this.description = description;
        this.translation = translation;
        this.deck = deck;
    }

    public Card(String language, String status, String description, String translation, Deck deck) {
        this.language = language;
        this.status = status;
        this.description = description;
        this.translation = translation;
        this.deck = deck;
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

    public Deck getDeck() {
        return this.deck;
    }

    public void setDeck(Deck deck) {
        this.deck = deck;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Card card = (Card) o;
        return cardId != null && cardId.equals(card.cardId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

}
