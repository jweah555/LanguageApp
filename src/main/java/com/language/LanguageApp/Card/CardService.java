package com.language.LanguageApp.Card;

import java.util.List;
import com.language.LanguageApp.Users.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.ResourceAccessException;

import com.language.LanguageApp.BadRequestException;
import com.language.LanguageApp.ResourceNotFoundException;

@Service
public class CardService {

    private UsersRepository usersRepository;
    @Autowired
    private CardRepository cardRepository;

    
    public List<Card> getAllCards(){
        List<Card> cards = cardRepository.findAll();
        if (cards.isEmpty()) {
            throw new ResourceAccessException("Card not found");
        }
        return cards;
    }

    public Card getCardById(@PathVariable long cardId) {
        Card card = cardRepository.findById(cardId).orElseThrow(() -> new ResourceAccessException("Card with ID " + cardId + " not found"));
        return card;
    }

    public List<Card> getCardsByLanguage(String language) {
        List<Card> cards = cardRepository.findByLanguage(language);
        if(cards.isEmpty()) {
            throw new ResourceAccessException("No card found");
        }
        return cards;
    }

    public List<Card> getCardsByStatus(String status) {
        List<Card> cards = cardRepository.findByStatus(status);
        if (cards.isEmpty()) {
            throw new ResourceNotFoundException("No card found with the status " + status);
        }
        return cards;
    }

    public Card addCard(Card card) {
        if (card == null) {
            throw new ResourceNotFoundException("Card object not found");
        }
    return cardRepository.save(card);

    }

    public Card updateCardById(Long cardId, Card updatedCard ){
        Card existingCard = cardRepository.findById(cardId).orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        existingCard.setDeck(updatedCard.getDecks());
        existingCard.setDescription(updatedCard.getDescription());
        existingCard.setLanguage(updatedCard.getLanguage());
        existingCard.setStatus(updatedCard.getStatus());
        existingCard.setTranslation(updatedCard.getTranslation());
        existingCard.setUsers(updatedCard.getUser());

        return cardRepository.save(existingCard);
    }

    public void deleteCardById(Long cardId) {
       
        if(!cardRepository.existsById(cardId)){
            throw new BadRequestException("No card found");
        }
        cardRepository.deleteById(cardId);
    }


}
