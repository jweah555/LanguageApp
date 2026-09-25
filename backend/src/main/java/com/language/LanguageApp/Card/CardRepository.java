package com.language.LanguageApp.Card;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByLanguage(String language);

    // ---- Spaced repetition ----

    //Cards due today or earlier across all the user's decks, most overdue first
    @Query("""
            select c from Card c
            where c.deck.owner.usersId = :userId and c.dueDate <= :today
            order by c.dueDate asc, c.cardId asc""")
    List<Card> findDue(@Param("userId") Long userId, @Param("today") LocalDate today, Pageable limit);

    //Same as findDue, limited to one deck
    @Query("""
            select c from Card c
            where c.deck.owner.usersId = :userId and c.deck.deckId = :deckId and c.dueDate <= :today
            order by c.dueDate asc, c.cardId asc""")
    List<Card> findDueInDeck(@Param("userId") Long userId, @Param("deckId") Long deckId,
            @Param("today") LocalDate today, Pageable limit);

    //Never-reviewed cards across all the user's decks, oldest first
    @Query("""
            select c from Card c
            where c.deck.owner.usersId = :userId and c.lastReviewedOn is null
            order by c.createdAt asc, c.cardId asc""")
    List<Card> findNew(@Param("userId") Long userId, Pageable limit);

    //Same as findNew, limited to one deck
    @Query("""
            select c from Card c
            where c.deck.owner.usersId = :userId and c.deck.deckId = :deckId and c.lastReviewedOn is null
            order by c.createdAt asc, c.cardId asc""")
    List<Card> findNewInDeck(@Param("userId") Long userId, @Param("deckId") Long deckId, Pageable limit);

    //How many of the user's cards are due on one day; used by the overflow rule
    @Query("select count(c) from Card c where c.deck.owner.usersId = :userId and c.dueDate = :date")
    long countDueOn(@Param("userId") Long userId, @Param("date") LocalDate date);

    //Per deck: [deckId, number of cards due today or earlier]
    @Query("""
            select c.deck.deckId, count(c) from Card c
            where c.deck.owner.usersId = :userId and c.dueDate <= :today
            group by c.deck.deckId""")
    List<Object[]> countDueByDeck(@Param("userId") Long userId, @Param("today") LocalDate today);

    //Per deck: [deckId, number of never-reviewed cards]
    @Query("""
            select c.deck.deckId, count(c) from Card c
            where c.deck.owner.usersId = :userId and c.lastReviewedOn is null
            group by c.deck.deckId""")
    List<Object[]> countNewByDeck(@Param("userId") Long userId);
}
