package com.language.LanguageApp.Card;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CardController {
    @Autowired
    private CardService cardService;

    @GetMapping("/cards")
    public ResponseEntity<List<Card>> getAllCards(){
        try {
            List<Card> cards = cardService.getAllCards();
            return ResponseEntity.ok(cards);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/cards")
    public ResponseEntity<Card> addCard(@RequestBody Card card) {
        try {
            Card newCard = cardService.addCard(card);
            return ResponseEntity.status(HttpStatus.CREATED).body(newCard);
        } catch (Exception e){
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cards/{language}")
    public ResponseEntity<List<Card>> getCardsByLanguage(@PathVariable("language") String language) {
        try {
            List<Card> newCard = cardService.getCardsByLanguage(language);
            return ResponseEntity.ok(newCard);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/cards/status/{status}")
    public ResponseEntity<List<Card>> getCardsByStatus(@PathVariable("status") String status) {
        try {
            List<Card> newCard = cardService.getCardsByStatus(status);
            return ResponseEntity.ok(newCard);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/cards/update/{cardId}")
    public ResponseEntity<Card> updateCard(@PathVariable("cardId") Long cardId, @RequestBody Card updatedCard) {
        try {
            Card newCard = cardService.updateCardById(cardId, updatedCard);
            return ResponseEntity.ok(newCard);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/cards/delete/{cardId}")
    public ResponseEntity<Void> deleteCard(@PathVariable("cardId") Long cardId) {
        try {
            cardService.deleteCardById(cardId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
        
    }

    

}
