package com.language.LanguageApp.Review;

//What happened after a rating; practice = same-day repeat that didn't change the schedule
public record ReviewResultDto(boolean practice, ReviewCardDto card) {
}
