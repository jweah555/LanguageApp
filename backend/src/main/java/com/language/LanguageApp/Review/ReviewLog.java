package com.language.LanguageApp.Review;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.language.LanguageApp.Card.Card;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

//One row per review of a card
@Entity
@Table(name = "review_log")
public class ReviewLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_log_id")
    private Long reviewLogId;

    //Card that was reviewed; the database deletes its logs when the card is deleted
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "card_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Card card;

    @Enumerated(EnumType.STRING)
    @Column(name = "rating", nullable = false, length = 10)
    private Rating rating;

    //True = a same-day repeat that didn't count toward scheduling
    @Column(name = "practice", nullable = false, columnDefinition = "boolean not null default false")
    private boolean practice = false;

    @CreationTimestamp
    @Column(name = "reviewed_at", nullable = false, updatable = false,
            columnDefinition = "timestamp with time zone not null default now()")
    private Instant reviewedAt;

    public ReviewLog() {
    }

    public ReviewLog(Card card, Rating rating, boolean practice) {
        this.card = card;
        this.rating = rating;
        this.practice = practice;
    }

    public Long getReviewLogId() {
        return this.reviewLogId;
    }

    public Card getCard() {
        return this.card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public Rating getRating() {
        return this.rating;
    }

    public void setRating(Rating rating) {
        this.rating = rating;
    }

    public boolean isPractice() {
        return this.practice;
    }

    public void setPractice(boolean practice) {
        this.practice = practice;
    }

    public Instant getReviewedAt() {
        return this.reviewedAt;
    }
}
