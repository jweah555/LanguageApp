package com.language.LanguageApp.Users;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.language.LanguageApp.Deck.Deck;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long usersId;

    @Column(name = "first_name",nullable = false)
    private String firstName;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "password",nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "role", nullable = false)
    private String role;
    
    @Column(name = "language",nullable = false)
    private String language;

    // ---- Spaced repetition settings ----
    // columnDefinition carries the SQL defaults so ddl-auto can add the NOT NULL
    // columns to a table that already has rows.

    //Most reviews shown per day; the rest overflow to the next day
    @Column(name = "daily_review_cap", nullable = false, columnDefinition = "integer not null default 30")
    private int dailyReviewCap = 30;

    //New cards introduced per day
    @Column(name = "new_cards_per_day", nullable = false, columnDefinition = "integer not null default 10")
    private int newCardsPerDay = 10;

    //IANA zone like America/New_York; defines the user's "today"
    @Column(name = "timezone", nullable = false, length = 64,
            columnDefinition = "varchar(64) not null default 'UTC'")
    private String timezone = "UTC";

    // Decks owned by this user
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnoreProperties("owner") // Prevents recursion during JSON serialization
    private Set<Deck> decks = new HashSet<>();

    public Users() {
    }

    public Users(Long usersId, String firstName, String lastName, String role, String language, Set<Deck> decks) {
        this.usersId = usersId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
    }

    public Users(String firstName, String lastName, String role, String language, Set<Deck> decks) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.language = language;
        this.decks = decks;
    }

    public Long getUsersId() {
        return this.usersId;
    }

    public void setUsersId(Long usersId) {
        this.usersId = usersId;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getRole() {
        return this.role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getLanguage() {
        return this.language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Set<Deck> getDecks() {
        return this.decks;
    }

    public void setDeck(Set<Deck> decks) {
        this.decks = decks;
    }

    public void addDeck(Deck deck) {
        this.decks.add(deck);
        deck.setOwner(this);
    }

    public void removeDeck(Deck deck) {
        this.decks.remove(deck);
        deck.setOwner(null);
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPassword() {
        return this.password;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserName() {
        return this.userName;
    }

    public int getDailyReviewCap() {
        return this.dailyReviewCap;
    }

    public void setDailyReviewCap(int dailyReviewCap) {
        this.dailyReviewCap = dailyReviewCap;
    }

    public int getNewCardsPerDay() {
        return this.newCardsPerDay;
    }

    public void setNewCardsPerDay(int newCardsPerDay) {
        this.newCardsPerDay = newCardsPerDay;
    }

    public String getTimezone() {
        return this.timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Users users = (Users) o;
        return usersId != null && usersId.equals(users.usersId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
