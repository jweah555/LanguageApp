package com.language.LanguageApp.Review;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.language.LanguageApp.Card.Card;
import com.language.LanguageApp.Card.CardRepository;
import com.language.LanguageApp.Deck.Deck;
import com.language.LanguageApp.Deck.DeckRepository;
import com.language.LanguageApp.Users.Users;

//Rating rules, scheduling and overflow, with the repositories mocked out
@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private CardRepository cardRepository;

    @Mock
    private ReviewLogRepository reviewLogRepository;

    @Mock
    private DeckRepository deckRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Users user;
    private Card card;
    private LocalDate today;

    @BeforeEach
    void setUp() {
        user = new Users();
        user.setUsersId(1L);
        user.setTimezone("UTC");
        today = LocalDate.now(ZoneOffset.UTC);

        Deck deck = new Deck();
        deck.setDeckId(10L);
        deck.setOwner(user);

        card = new Card();
        card.setCardId(100L);
        card.setFront("Hola");
        card.setBack("Hello");
        card.setDeck(deck);

        when(cardRepository.findById(100L)).thenReturn(Optional.of(card));
    }

    private ReviewResultDto rate(Rating rating) {
        return reviewService.review(user, 100L, rating);
    }

    private void reviewedBefore(int level) {
        card.setLevel((short) level);
        card.setLastReviewedOn(today.minusDays(3));
        card.setDueDate(today);
    }

    @Test
    void newCardRatedEasySkipsToSevenDays() {
        rate(Rating.EASY);
        assertEquals(2, card.getLevel());
        assertEquals(today.plusDays(7), card.getDueDate());
        assertEquals(today, card.getLastReviewedOn());
    }

    @Test
    void newCardRatedMediumGoesToThreeDays() {
        rate(Rating.MEDIUM);
        assertEquals(1, card.getLevel());
        assertEquals(today.plusDays(3), card.getDueDate());
    }

    @Test
    void newCardRatedHardStaysAtOneDay() {
        rate(Rating.HARD);
        assertEquals(0, card.getLevel());
        assertEquals(today.plusDays(1), card.getDueDate());
    }

    @Test
    void forgettingANewCardIsNotALapse() {
        rate(Rating.FORGOT);
        assertEquals(0, card.getLapses());
        assertEquals(today.plusDays(1), card.getDueDate());
    }

    @Test
    void forgettingAReviewedCardResetsAndCountsALapse() {
        reviewedBefore(4);
        rate(Rating.FORGOT);
        assertEquals(0, card.getLevel());
        assertEquals(1, card.getLapses());
        assertEquals(today.plusDays(1), card.getDueDate());
    }

    @Test
    void easyAfterAResetOnlyClimbsOneLevel() {
        reviewedBefore(0);
        rate(Rating.EASY);
        assertEquals(1, card.getLevel());
        assertEquals(today.plusDays(3), card.getDueDate());
    }

    @Test
    void mediumClimbsBelowFourteenDaysThenHolds() {
        reviewedBefore(2);
        rate(Rating.MEDIUM);
        assertEquals(3, card.getLevel());

        reviewedBefore(3);
        rate(Rating.MEDIUM);
        assertEquals(3, card.getLevel());
        assertEquals(today.plusDays(14), card.getDueDate());
    }

    @Test
    void hardDropsOneLevel() {
        reviewedBefore(5);
        rate(Rating.HARD);
        assertEquals(4, card.getLevel());
        assertEquals(today.plusDays(35), card.getDueDate());
    }

    @Test
    void easyAtTheTopStaysMastered() {
        reviewedBefore(6);
        rate(Rating.EASY);
        assertEquals(6, card.getLevel());
        assertEquals(today.plusDays(180), card.getDueDate());
    }

    @Test
    void sameDayRepeatIsPracticeAndChangesNothing() {
        card.setLevel((short) 2);
        card.setLastReviewedOn(today);
        card.setDueDate(today.plusDays(7));

        ReviewResultDto result = rate(Rating.FORGOT);

        assertTrue(result.practice());
        assertEquals(2, card.getLevel());
        assertEquals(today.plusDays(7), card.getDueDate());
        assertEquals(0, card.getLapses());
        verify(cardRepository, never()).save(any());
        ArgumentCaptor<ReviewLog> log = ArgumentCaptor.forClass(ReviewLog.class);
        verify(reviewLogRepository).save(log.capture());
        assertTrue(log.getValue().isPractice());
        assertEquals(user, log.getValue().getUser());
    }

    @Test
    void countedReviewIsLoggedAsNotPractice() {
        ReviewResultDto result = rate(Rating.MEDIUM);
        assertFalse(result.practice());
        ArgumentCaptor<ReviewLog> log = ArgumentCaptor.forClass(ReviewLog.class);
        verify(reviewLogRepository).save(log.capture());
        assertFalse(log.getValue().isPractice());
        assertEquals(Rating.MEDIUM, log.getValue().getRating());
        assertEquals(user, log.getValue().getUser());
    }

    @Test
    void fullDayPushesCardToNextDayWithRoom() {
        LocalDate target = today.plusDays(7);
        when(cardRepository.countDueOn(anyLong(), any())).thenReturn(0L);
        when(cardRepository.countDueOn(1L, target)).thenReturn(30L);
        when(cardRepository.countDueOn(1L, target.plusDays(1))).thenReturn(30L);

        rate(Rating.EASY);

        assertEquals(target.plusDays(2), card.getDueDate());
    }

    @Test
    void everyDayFullLandsOnTheLastDayChecked() {
        when(cardRepository.countDueOn(eq(1L), any())).thenReturn(30L);

        rate(Rating.EASY);

        assertEquals(today.plusDays(7 + 7), card.getDueDate());
    }

    @Test
    void previewShowsTheWaitForEachRating() {
        ReviewResultDto result = reviewService.review(user, 100L, Rating.EASY);
        // After Easy the card is at level 2 and has been reviewed
        assertEquals(1, result.card().previewDays().get(Rating.FORGOT));
        assertEquals(3, result.card().previewDays().get(Rating.HARD));
        assertEquals(14, result.card().previewDays().get(Rating.MEDIUM));
        assertEquals(14, result.card().previewDays().get(Rating.EASY));
    }
}
