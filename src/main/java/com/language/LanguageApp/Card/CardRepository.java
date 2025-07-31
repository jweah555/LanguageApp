package com.language.LanguageApp.Card;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByLanguage(String language);
    List<Card> findByStatus(String status);

}
