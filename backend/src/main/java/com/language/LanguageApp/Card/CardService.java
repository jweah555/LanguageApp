package com.language.LanguageApp.Card;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.language.LanguageApp.BadRequestException;
import com.language.LanguageApp.ForbiddenException;
import com.language.LanguageApp.ResourceNotFoundException;
import com.language.LanguageApp.Deck.Deck;
import com.language.LanguageApp.Deck.DeckRepository;
import com.language.LanguageApp.Users.Users;

@Service
public class CardService {

    @Autowired
    private CardRepository cardRepository;

    @Autowired
    private DeckRepository deckRepository;

    
    public List<Card> getAllCards(){
        List<Card> cards = cardRepository.findAll();
        if (cards.isEmpty()) {
            throw new ResourceNotFoundException("No cards found");
        }
        return cards;
    }

    public Card getCardById(@PathVariable long cardId) {
        Card card = cardRepository.findById(cardId).orElseThrow(() -> new ResourceNotFoundException("Card with ID " + cardId + " not found"));
        return card;
    }

    public List<Card> getCardsByLanguage(String language) {
        List<Card> cards = cardRepository.findByLanguage(language);
        if(cards.isEmpty()) {
            throw new ResourceNotFoundException("No card found");
        }
        return cards;
    }

    public Card addCard(Long deckId, Card card, Users currentUser) {
        if (card == null) {
            throw new BadRequestException("Card object must not be null");
        }
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck with ID " + deckId + " not found"));
        if (!deck.getOwner().equals(currentUser)) {
            throw new ForbiddenException("You do not have access to this deck");
        }
        card.setDeck(deck);
        return cardRepository.save(card);
    }

    public Card updateCardById(Long cardId, Card updatedCard ){
        Card existingCard = cardRepository.findById(cardId).orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        existingCard.setFront(updatedCard.getFront());
        existingCard.setLanguage(updatedCard.getLanguage());
        existingCard.setBack(updatedCard.getBack());

        return cardRepository.save(existingCard);
    }

    public void deleteCardById(Long cardId) {

        if(!cardRepository.existsById(cardId)){
            throw new ResourceNotFoundException("No card found");
        }
        cardRepository.deleteById(cardId);
    }


}
