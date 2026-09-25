package com.language.LanguageApp.Review;

import java.util.List;

//Today's queue: due cards first (most overdue first), then new cards
public record ReviewSessionDto(List<ReviewCardDto> cards, int dueCount, int newCount) {
}
