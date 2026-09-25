package com.language.LanguageApp.Card;

import java.time.Instant;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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

    //Target language the user is learning; the language of the front of the card
    @Column(name = "language",nullable = false)
    private String language;

    //Word or phrase in the target language
    @Column(name = "front", nullable = false)
    private String front;

    //Meaning in the source language the user already knows
    @Column(name = "back", nullable = false)
    private String back;

    // ---- Spaced repetition ----
    // These are read-only over JSON: only the review logic should change them,
    // never a create/update request from the client.
    // columnDefinition carries the SQL defaults so ddl-auto can add the NOT NULL
    // columns to a table that already has rows.

    //Position on the 0-6 ladder; 6 = mastered
    @Column(name = "level", nullable = false, columnDefinition = "smallint not null default 0")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private short level = 0;

    //Next day the card should be reviewed; null = new card, never reviewed
    @Column(name = "due_date")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDate dueDate;

    //Day of the last counted review; blocks same-day repeats from counting
    @Column(name = "last_reviewed_on")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDate lastReviewedOn;

    //Times the card was forgotten
    @Column(name = "lapses", nullable = false, columnDefinition = "integer not null default 0")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private int lapses = 0;

    //When the card was created; orders new cards
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false,
            columnDefinition = "timestamp with time zone not null default now()")
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Instant createdAt;

    //Deck this card belongs to; a card always belongs to exactly one deck
    @ManyToOne
    @JoinColumn(name = "deck_id", nullable = false)
    @JsonIgnoreProperties("cards")
    private Deck deck;

    public Card() {
    }

    public Card(Long cardId, String language, String front, String back, Deck deck) {
        this.cardId = cardId;
        this.language = language;
        this.front = front;
        this.back = back;
        this.deck = deck;
    }

    public Card(String language, String front, String back, Deck deck) {
        this.language = language;
        this.front = front;
        this.back = back;
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

    public String getFront() {
        return this.front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return this.back;
    }

    public void setBack(String back) {
        this.back = back;
    }

    public short getLevel() {
        return this.level;
    }

    public void setLevel(short level) {
        this.level = level;
    }

    public LocalDate getDueDate() {
        return this.dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getLastReviewedOn() {
        return this.lastReviewedOn;
    }

    public void setLastReviewedOn(LocalDate lastReviewedOn) {
        this.lastReviewedOn = lastReviewedOn;
    }

    public int getLapses() {
        return this.lapses;
    }

    public void setLapses(int lapses) {
        this.lapses = lapses;
    }

    public Instant getCreatedAt() {
        return this.createdAt;
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
