package com.language.LanguageApp.Deck;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.language.LanguageApp.Users.Users;
import com.language.LanguageApp.Users.UsersService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;

@RestController
public class DeckController {
    @Autowired
    private DeckService deckService;

    @Autowired
    private UsersService usersService;

    @GetMapping("/decks")
    public ResponseEntity<List<Deck>> getAllDecks() {
        List<Deck> decks = deckService.getAllDecks();
        return ResponseEntity.ok(decks);
    }

    @PostMapping("/decks")
    public ResponseEntity<Deck> addDeck(@RequestBody Deck deck, Authentication authentication) {
        Users owner = usersService.getAuthenticatedUser(authentication);
        Deck createdDeck = deckService.addDeck(deck, owner);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDeck);
    }

    @GetMapping("/decks/{deckId}")
    public ResponseEntity<Deck> getDeckById(@PathVariable("deckId") Long deckId) {
        Deck deck = deckService.getDeckById(deckId);
        return ResponseEntity.ok(deck);
    }

    @GetMapping("/decks/language/{language}")
    public ResponseEntity<List<Deck>> getDeckByLanguage(@PathVariable("language") String language) {
        List<Deck> decks = deckService.getDeckByLanguage(language);
        return ResponseEntity.ok(decks);
    }

    @GetMapping("/decks/users/{userId}")
    public ResponseEntity<List<Deck>> getDecksByOwnerId(@PathVariable("userId") Long userId) {
        List<Deck> decks = deckService.getDeckByOwner(userId);
        return ResponseEntity.ok(decks);
    }

    @PutMapping("/decks/{deckId}")
    public ResponseEntity<Deck> updateDeckById(@PathVariable("deckId") Long deckId, @RequestBody Deck updatedDeck) {
        Deck newDeck = deckService.updateDeck(deckId, updatedDeck);
        return ResponseEntity.ok(newDeck);
    }

    @DeleteMapping("/decks/{deckId}")
    public ResponseEntity<Void> deleteById(@PathVariable("deckId") Long deckId) {
        deckService.deleteDeck(deckId);
        return ResponseEntity.noContent().build();
    }

}
