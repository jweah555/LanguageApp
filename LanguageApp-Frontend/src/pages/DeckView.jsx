import "../pages/DeckView.css";
import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeleteDeckModal from "../components/DeleteDeckModal/DeleteDeckModal";
import { deckDisplayName, isLikedDeck } from "../utils/deck";
import { API_BASE } from "../utils/api.js";

function DeckView() {
  const { deckId } = useParams();
  // Opened from the Spaced Repetition page: view and study only, no editing
  const [searchParams] = useSearchParams();
  const fromPractice = searchParams.get("from") === "practice";
  const backLink = fromPractice ? "/spacedRepetition" : "/userDeck";
  const { user, loading } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/decks/${deckId}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setDeck(data);
        // Cards come back as a set, so sort them to keep the order stable
        setCards([...data.cards].sort((a, b) => a.cardId - b.cardId));
      })
      .catch(() => setMessage("Could not load this deck"));
  }, [user, deckId]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (message) {
    return (
      <div className="deck-view-page">
        <div className="deck-view-empty">
          <p>{message}</p>
          <Link to={backLink} className="deck-view-button secondary">
            Back to decks
          </Link>
        </div>
      </div>
    );
  }

  if (!deck) {
    return null;
  }

  return (
    <div className="deck-view-page">
      <Link to={backLink} className="deck-view-back">
        &larr; {fromPractice ? "Back to Spaced Repetition" : "Back to decks"}
      </Link>

      <div className="deck-view-header">
        <div>
          {deck.language && (
            <span className="deck-view-language">{deck.language}</span>
          )}
          <h1 className="deck-view-title">{deckDisplayName(deck)}</h1>
          {deck.deckName && deck.description && (
            <p className="deck-view-description">{deck.description}</p>
          )}
        </div>
        <div className="deck-view-actions">
          {!fromPractice && (
            <Link to="/createCard" className="deck-view-button secondary">
              + Add card
            </Link>
          )}
          {cards.length > 0 && (
            <Link
              to={fromPractice ? `/spacedRepetition/${deck.deckId}` : `/userDeck/${deck.deckId}`}
              className="deck-view-button primary"
            >
              Study
            </Link>
          )}
          {!fromPractice && !isLikedDeck(deck) && (
            <button
              type="button"
              className="deck-view-button deck-view-delete"
              onClick={() => setConfirmingDelete(true)}
            >
              Delete deck
            </button>
          )}
        </div>
      </div>

      <p className="deck-view-count">
        {cards.length} {cards.length === 1 ? "card" : "cards"}
      </p>

      {cards.length === 0 ? (
        <div className="deck-view-empty">
          <h2>This deck has no cards yet</h2>
          <p>
            {fromPractice
              ? "Add cards from Your Decks, then come back to practice."
              : "Add a few cards to start building your deck."}
          </p>
        </div>
      ) : (
        <ol className="deck-view-list">
          <li className="deck-view-row deck-view-labels" aria-hidden="true">
            <span />
            <span>Front</span>
            <span>Back</span>
          </li>
          {cards.map((card, i) => (
            <li className="deck-view-row" key={card.cardId}>
              <span className="deck-view-number">{i + 1}</span>
              <span className="deck-view-front">{card.front}</span>
              <span className="deck-view-back-text">{card.back}</span>
            </li>
          ))}
        </ol>
      )}

      {confirmingDelete && (
        <DeleteDeckModal
          deck={deck}
          onClose={() => setConfirmingDelete(false)}
          onDeleted={() => navigate("/userDeck", { replace: true })}
        />
      )}
    </div>
  );
}

export default DeckView;
