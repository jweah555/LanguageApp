package com.language.LanguageApp.Review;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.language.LanguageApp.Users.Users;
import com.language.LanguageApp.Users.UsersService;

@RestController
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UsersService usersService;

    //Today's review queue; leave out deckId to study all decks together
    @GetMapping("/review/session")
    public ResponseEntity<ReviewSessionDto> getSession(@RequestParam(value = "deckId", required = false) Long deckId,
            Authentication authentication) {
        Users user = usersService.getAuthenticatedUser(authentication);
        return ResponseEntity.ok(reviewService.getSession(user, deckId));
    }

    //Due and new counts per deck, for the Spaced Repetition page
    @GetMapping("/review/summary")
    public ResponseEntity<List<DeckReviewSummaryDto>> getSummary(Authentication authentication) {
        Users user = usersService.getAuthenticatedUser(authentication);
        return ResponseEntity.ok(reviewService.getSummary(user));
    }

    //Rate a card: FORGOT, HARD, MEDIUM or EASY
    @PostMapping("/cards/{cardId}/review")
    public ResponseEntity<ReviewResultDto> review(@PathVariable("cardId") Long cardId,
            @RequestBody ReviewRequest request, Authentication authentication) {
        Users user = usersService.getAuthenticatedUser(authentication);
        return ResponseEntity.ok(reviewService.review(user, cardId, request.rating()));
    }
}
