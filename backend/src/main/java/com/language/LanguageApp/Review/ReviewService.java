package com.language.LanguageApp.Review;

import java.time.DateTimeException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.language.LanguageApp.BadRequestException;
import com.language.LanguageApp.ForbiddenException;
import com.language.LanguageApp.ResourceNotFoundException;
import com.language.LanguageApp.Card.Card;
import com.language.LanguageApp.Card.CardRepository;
import com.language.LanguageApp.Deck.Deck;
import com.language.LanguageApp.Deck.DeckRepository;
import com.language.LanguageApp.Users.Users;

@Service
public class ReviewService {

    //Days until the next review for each level; level 6 = mastered
    private static final int[] INTERVALS = {1, 3, 7, 14, 35, 90, 180};

    //How many extra days the overflow rule may push a card
    private static final int MAX_OVERFLOW_DAYS = 7;

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private ReviewLogRepository reviewLogRepository;

    @Autowired
    private DeckRepository deckRepository;

    //Today's queue for one deck, or all the user's decks when deckId is null.
    //The daily limits are totals for the day, so a second session only gets what's left.
    @Transactional(readOnly = true)
    public ReviewSessionDto getSession(Users user, Long deckId) {
        ZoneId zone = zoneOf(user);
        LocalDate today = LocalDate.now(zone);
        Instant startOfDay = today.atStartOfDay(zone).toInstant();
        Instant endOfDay = today.plusDays(1).atStartOfDay(zone).toInstant();

        long countedToday = reviewLogRepository.countReviewsBetween(user.getUsersId(), startOfDay, endOfDay);
        long newToday = reviewLogRepository.countNewCardsIntroducedBetween(user.getUsersId(), startOfDay, endOfDay);
        long dueReviewedToday = countedToday - newToday;

        int dueLeft = (int) Math.max(0, user.getDailyReviewCap() - dueReviewedToday);
        int newLeft = (int) Math.max(0, user.getNewCardsPerDay() - newToday);

        List<Card> due = dueLeft == 0 ? List.of()
                : deckId == null
                        ? cardRepository.findDue(user.getUsersId(), today, PageRequest.of(0, dueLeft))
                        : cardRepository.findDueInDeck(user.getUsersId(), deckId, today, PageRequest.of(0, dueLeft));
        List<Card> fresh = newLeft == 0 ? List.of()
                : deckId == null
                        ? cardRepository.findNew(user.getUsersId(), PageRequest.of(0, newLeft))
                        : cardRepository.findNewInDeck(user.getUsersId(), deckId, PageRequest.of(0, newLeft));

        List<ReviewCardDto> cards = new ArrayList<>();
        due.forEach(card -> cards.add(toDto(card)));
        fresh.forEach(card -> cards.add(toDto(card)));
        return new ReviewSessionDto(cards, due.size(), fresh.size());
    }

    //Due and new counts for each of the user's decks
    @Transactional(readOnly = true)
    public List<DeckReviewSummaryDto> getSummary(Users user) {
        LocalDate today = LocalDate.now(zoneOf(user));
        Map<Long, Long> dueByDeck = toCountMap(cardRepository.countDueByDeck(user.getUsersId(), today));
        Map<Long, Long> newByDeck = toCountMap(cardRepository.countNewByDeck(user.getUsersId()));

        List<DeckReviewSummaryDto> summary = new ArrayList<>();
        for (Deck deck : deckRepository.findByOwner_UsersId(user.getUsersId())) {
            summary.add(new DeckReviewSummaryDto(deck.getDeckId(),
                    dueByDeck.getOrDefault(deck.getDeckId(), 0L),
                    newByDeck.getOrDefault(deck.getDeckId(), 0L)));
        }
        return summary;
    }

    //Applies a rating to a card: moves it on the ladder, schedules it and logs the review
    @Transactional
    public ReviewResultDto review(Users user, Long cardId, Rating rating) {
        if (rating == null) {
            throw new BadRequestException("Rating must be FORGOT, HARD, MEDIUM or EASY");
        }
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card with ID " + cardId + " not found"));
        if (!card.getDeck().getOwner().equals(user)) {
            throw new ForbiddenException("You do not have access to this card");
        }

        LocalDate today = LocalDate.now(zoneOf(user));

        // Same-day repeat: log it as practice, change nothing
        if (today.equals(card.getLastReviewedOn())) {
            reviewLogRepository.save(new ReviewLog(user, card, rating, true));
            return new ReviewResultDto(true, toDto(card));
        }

        boolean isNew = card.getLastReviewedOn() == null;
        int level = nextLevel(card.getLevel(), rating, isNew);
        LocalDate due = today.plusDays(INTERVALS[level]);

        // Overflow: push to the next day with room, at most 7 days; if all are full it stays on the last one
        for (int i = 0; i < MAX_OVERFLOW_DAYS
                && cardRepository.countDueOn(user.getUsersId(), due) >= user.getDailyReviewCap(); i++) {
            due = due.plusDays(1);
        }

        card.setLevel((short) level);
        card.setDueDate(due);
        card.setLastReviewedOn(today);
        // Forgetting a card that was never learned isn't a lapse
        if (rating == Rating.FORGOT && !isNew) {
            card.setLapses(card.getLapses() + 1);
        }
        cardRepository.save(card);
        reviewLogRepository.save(new ReviewLog(user, card, rating, false));
        return new ReviewResultDto(false, toDto(card));
    }

    private int nextLevel(int level, Rating rating, boolean isNew) {
        return switch (rating) {
            case FORGOT -> 0;
            case HARD -> Math.max(0, level - 1);
            // Climbs while the wait is under 14 days, then holds steady
            case MEDIUM -> level < 3 ? level + 1 : level;
            // A card already known on its first review skips to the 7-day level
            case EASY -> isNew ? 2 : Math.min(6, level + 1);
        };
    }

    private ReviewCardDto toDto(Card card) {
        boolean isNew = card.getLastReviewedOn() == null;
        Map<Rating, Integer> previewDays = new EnumMap<>(Rating.class);
        for (Rating rating : Rating.values()) {
            previewDays.put(rating, INTERVALS[nextLevel(card.getLevel(), rating, isNew)]);
        }
        Deck deck = card.getDeck();
        String deckName = deck.getDeckName() != null ? deck.getDeckName() : deck.getDescription();
        return new ReviewCardDto(card.getCardId(), deck.getDeckId(), deckName, card.getFront(), card.getBack(),
                card.getLanguage(), card.getLevel(), card.getDueDate(), card.getLastReviewedOn(), card.getLapses(),
                isNew, previewDays);
    }

    //The user's time zone defines "today"; fall back to UTC if it isn't a valid zone
    private ZoneId zoneOf(Users user) {
        try {
            return ZoneId.of(user.getTimezone());
        } catch (DateTimeException | NullPointerException e) {
            return ZoneOffset.UTC;
        }
    }

    private Map<Long, Long> toCountMap(List<Object[]> rows) {
        Map<Long, Long> counts = new HashMap<>();
        for (Object[] row : rows) {
            counts.put((Long) row[0], (Long) row[1]);
        }
        return counts;
    }
}
