package com.language.LanguageApp.Card;

import com.language.LanguageApp.Deck.Deck;

import jakarta.annotation.Generated;
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
    private Long cardId;
    
    @Column(nullable = false)
    private String language;

    @Column(nullable = true)
    private String status;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String translation;

    
    @ManyToOne
    @JoinColumn(name = "deck_id")
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

}
