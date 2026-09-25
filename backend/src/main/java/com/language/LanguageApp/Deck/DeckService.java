package com.language.LanguageApp.Deck;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.language.LanguageApp.BadRequestException;
import com.language.LanguageApp.ForbiddenException;
import com.language.LanguageApp.ResourceNotFoundException;
import com.language.LanguageApp.Users.Users;
import com.language.LanguageApp.Users.UsersRepository;

@Service
public class DeckService {
    
    @Autowired
    private DeckRepository deckRepository;
    
    @Autowired 
    private UsersRepository usersRepo;

    public List<Deck> getAllDecks() {
        List<Deck> decks = deckRepository.findAll();
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

    public Deck addDeck(Deck deck, Users owner) {
        if (deck == null) {
            throw new BadRequestException("Deck object must not be null");
        }
        deck.setOwner(owner);
        return deckRepository.save(deck);
    }

    public Deck updateDeck(Long deckId, Deck updatedDeck) {
        Deck existingDeck = deckRepository.findById(deckId)
        .orElseThrow(() -> new ResourceNotFoundException("Deck with ID " + deckId + "not found"));
        existingDeck.setDeckName(updatedDeck.getDeckName());
        existingDeck.setDescription(updatedDeck.getDescription());
        existingDeck.setLanguage(updatedDeck.getLanguage());

        
        return deckRepository.save(existingDeck);
    }

    public List<Deck> getDeckByOwner(Long userId) {
        if(!usersRepo.existsById(userId)) {
            throw new ResourceNotFoundException("Deck with id " + userId + "Not foound");
        }

       return deckRepository.findByOwner_UsersId(userId);
    }
    
    public void deleteDeck(Long deckId, Users currentUser) {
        Deck deck = deckRepository.findById(deckId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck with id " + deckId + " not found"));
        if (!deck.getOwner().equals(currentUser)) {
            throw new ForbiddenException("You do not have access to this deck");
        }
        // The Liked Cards deck is where translations get saved, so it has to stay
        if (deck.isDefault()) {
            throw new BadRequestException("Your Liked Cards deck cannot be deleted");
        }
        deckRepository.delete(deck);
    }

    



   
    
    
}
