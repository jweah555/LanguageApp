package com.language.LanguageApp.Deck;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PutMapping;


@RestController
public class DeckController {
    @Autowired
    private DeckService deckService;

    @GetMapping("/decks")
    public ResponseEntity <List<Deck>> getAllDecks() {
        try {
            List<Deck> decks = deckService.getAllDecks();
            return ResponseEntity.ok(decks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
        
    }

    @PostMapping("/decks")
    public ResponseEntity <Deck> addDeck(@RequestBody Deck deck) {
        try {
            Deck createdDeck = deckService.addDeck(deck);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDeck);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
        
    }

    @GetMapping("/decks/{deckId}")
    public ResponseEntity <Deck> getDeckById(@PathVariable("deckId") Long deckId) {
        try {
            Deck deck = deckService.getDeckById(deckId);
            return ResponseEntity.ok(deck);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/decks/language/{language}")
    public ResponseEntity <List<Deck>> getDeckByLanguage(@PathVariable("language") String language) {
        try {
            List<Deck> decks = deckService.getDeckByLanguage(language);
        return ResponseEntity.ok(decks);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
        
    }

    @PutMapping("/decks/{deckId}")
    public ResponseEntity <Deck> updateDeckById(@PathVariable("deckId") Long deckId,@RequestBody Deck updatedDeck ) {   
          try {
            Deck newDeck = deckService.updateDeck(deckId, updatedDeck);
            return ResponseEntity.ok(newDeck);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    

    @DeleteMapping("/decks/{deckId}")
    public ResponseEntity<Void> deleteById(@PathVariable("deckId") Long deckId) {
           try {
             deckService.deleteDeck(deckId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
           return ResponseEntity.notFound().build();
        }
    }


    

    

    


    





  



}
