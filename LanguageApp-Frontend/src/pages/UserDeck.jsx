import "../pages/UserDeck.css";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteDeckModal from "../components/DeleteDeckModal/DeleteDeckModal";
import { deckDisplayName, isLikedDeck } from "../utils/deck";

function UserDeck() {
  const { user, loading } = useAuth();
  const [decks, setDecks] = useState([]);
  const [deckToDelete, setDeckToDelete] = useState(null);

  useEffect(() => {
    if (!user) return; 

    fetch(`http://localhost:8080/decks/users/${user.usersId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDecks(data))
      .catch(() => setDecks([]));
  }, [user]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="user-deck-page">
      <div className="user-deck-header">
        <div>
          <h1 className="user-deck-title">Your Decks</h1>
          <p className="user-deck-subtitle">
            {decks.length} {decks.length === 1 ? "deck" : "decks"} ready to study
          </p>
        </div>
        <Link to="/createDeck" className="create-deck-link">
          + Create Deck
        </Link>
      </div>

      {decks.length === 0 ? (
        <div className="user-deck-empty">
          <h2>No decks yet</h2>
          <p>Create your first deck to start adding flashcards.</p>
          <Link to="/createDeck" className="create-deck-link">
            + Create Deck
          </Link>
        </div>
      ) : (
        <div className="user-deck-grid">
          {decks.map((deck) => (
            <div className="user-deck-card" key={deck.deckId}>
              <Link to={`/userDeck/${deck.deckId}/view`} className="deck-open-link">
                <div className="user-deck-top">
                  {deck.language && (
                    <span className="user-deck-language">{deck.language}</span>
                  )}
                  <span className="user-deck-count">
                    {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"}
                  </span>
                </div>
                <h2 className="user-deck-name">{deckDisplayName(deck)}</h2>
              </Link>
              <div className="user-deck-footer">
                <Link
                  to={`/userDeck/${deck.deckId}`}
                  className="user-deck-button study"
                >
                  Study
                </Link>
                <div className="user-deck-actions">
                  <Link to="/createCard" className="user-deck-button secondary">
                    Add
                  </Link>
                  <Link
                    to={`/userDeck/${deck.deckId}/view`}
                    className="user-deck-button primary"
                  >
                    View
                  </Link>
                </div>
              </div>
              {!isLikedDeck(deck) && (
                <button
                  type="button"
                  className="user-deck-delete"
                  onClick={() => setDeckToDelete(deck)}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M9 3h6l1 2h4v2H4V5h4l1-2zm-3 6h12l-1 12H7L6 9zm4 2v8h2v-8h-2zm4 0v8h2v-8h-2z"
                    />
                  </svg>
                  Delete deck
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {deckToDelete && (
        <DeleteDeckModal
          deck={deckToDelete}
          onClose={() => setDeckToDelete(null)}
          onDeleted={(deletedId) => {
            setDecks((current) => current.filter((d) => d.deckId !== deletedId));
            setDeckToDelete(null);
          }}
        />
      )}
    </div>
  );
}

export default UserDeck;
