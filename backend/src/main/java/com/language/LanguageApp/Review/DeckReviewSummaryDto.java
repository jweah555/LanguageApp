package com.language.LanguageApp.Review;

//How many cards in a deck are due today or earlier, and how many were never reviewed
public record DeckReviewSummaryDto(Long deckId, long dueCount, long newCount) {
}
