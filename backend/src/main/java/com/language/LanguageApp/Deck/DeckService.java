package com.language.LanguageApp.Deck;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.language.LanguageApp.BadRequestException;
import com.language.LanguageApp.ResourceNotFoundException;

@Service
public class DeckService {
    
    @Autowired
    private DeckRepository deckRepository;

    public List<Deck> getAllDecks() {
        List<Deck> decks = deckRepository.findAll();
        if (decks.isEmpty()) {
            throw new ResourceNotFoundException("Decks not found");
        }
        return decks;
    }

    public Deck getDeckById(@PathVariable long deckId) {
        return deckRepository.findById(deckId).orElseThrow(() -> new ResourceNotFoundException("Deck not found")); 
    }

    public List<Deck> getDeckByLanguage(String language) {
        List<Deck> decks = deckRepository.findByLanguage(language);
        if(decks.isEmpty()) {
            throw new ResourceNotFoundException("Decks not found");
        }
        return decks;
    }

    public Deck addDeck(Deck deck) {
        if (deck == null) {
            throw new BadRequestException("Deck object must not be null");
        }
        return deckRepository.save(deck);
    }

    public Deck updateDeck(Long deckId, Deck updatedDeck) {
        Deck existingDeck = deckRepository.findById(deckId)
        .orElseThrow(() -> new ResourceNotFoundException("Deck with ID " + deckId + "not found"));
        existingDeck.setCards(updatedDeck.getCards());
        existingDeck.setDescription(updatedDeck.getDescription());
        existingDeck.setLanguage(updatedDeck.getLanguage());
        existingDeck.setUsers(updatedDeck.getUsers());

        return deckRepository.save(existingDeck);
    }

    public void deleteDeck(Long deckId) {
        if(!deckRepository.existsById(deckId)) {
            throw new ResourceNotFoundException("Deck with id " + deckId + "Not foound");
        }
        deckRepository.deleteById(deckId);
    }

    



   
    
    
}
