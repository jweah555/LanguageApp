package com.language.LanguageApp.Review;

import java.time.LocalDate;
import java.util.Map;

//A card as the review page needs it, with how many days each rating would add
public record ReviewCardDto(
        Long cardId,
        Long deckId,
        String deckName,
        String front,
        String back,
        String language,
        int level,
        LocalDate dueDate,
        LocalDate lastReviewedOn,
        int lapses,
        boolean newCard,
        Map<Rating, Integer> previewDays) {
}
