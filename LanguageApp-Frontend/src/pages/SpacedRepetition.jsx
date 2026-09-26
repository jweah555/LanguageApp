import "../pages/UserDeck.css";
import "../pages/SpacedRepetition.css";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { deckDisplayName } from "../utils/deck";
import { API_BASE } from "../utils/api.js";

// Practice-only view of the user's decks: study or look at cards, no editing here
function SpacedRepetition() {
  const { user, loading } = useAuth();
  const [decks, setDecks] = useState([]);
  const [summary, setSummary] = useState({}); // deckId -> { dueCount, newCount }

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/decks/users/${user.usersId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDecks(data))
      .catch(() => setDecks([]));

    fetch(`${API_BASE}/review/summary`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then((rows) => setSummary(Object.fromEntries(rows.map((row) => [row.deckId, row]))))
      .catch(() => setSummary({}));
  }, [user]);

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const totalToStudy = Object.values(summary).reduce(
    (total, row) => total + row.dueCount + row.newCount,
    0
  );

  return (
    <div className="user-deck-page">
      <div className="user-deck-header">
        <div>
          <h1 className="user-deck-title">Spaced Repetition</h1>
          <p className="user-deck-subtitle">
            This is where you practice your decks with spaced repetition.
          </p>
        </div>
        <div className="sr-header-actions">
          <Link to="/userDeck" className="user-deck-button secondary">
            Edit decks
          </Link>
          {totalToStudy > 0 && (
            <Link to="/spacedRepetition/all" className="create-deck-link">
              Study all decks
            </Link>
          )}
        </div>
      </div>

      <div className="study-mode-bar">
        <p>
          <strong>Spaced repetition study.</strong> Prefer to go through your cards in the order
          they were added?
        </p>
        <Link to="/userDeck" className="study-mode-link">
          Study chronologically &rarr;
        </Link>
      </div>

      <aside className="sr-note">
        <h2>What is spaced repetition?</h2>
        <p>
          Instead of reviewing every card every day, you see each card again right before you
          would forget it. Cards you find easy come back less often, and cards you miss come back
          sooner. Short daily sessions this way help words stick in long-term memory.
        </p>
      </aside>

      {decks.length === 0 ? (
        <div className="user-deck-empty">
          <h2>No decks yet</h2>
          <p>Create a deck and add some cards, then come back here to practice.</p>
          <Link to="/userDeck" className="create-deck-link">
            Go to Your Decks
          </Link>
        </div>
      ) : (
        <div className="user-deck-grid">
          {decks.map((deck) => {
            const cardCount = deck.cards.length;
            const dueCount = summary[deck.deckId]?.dueCount ?? 0;
            const newCount = summary[deck.deckId]?.newCount ?? 0;
            return (
              <div className="user-deck-card" key={deck.deckId}>
                <Link
                  to={`/userDeck/${deck.deckId}/view?from=practice`}
                  className="deck-open-link"
                >
                  <div className="user-deck-top">
                    {deck.language && (
                      <span className="user-deck-language">{deck.language}</span>
                    )}
                    <span className="user-deck-count">
                      {cardCount} {cardCount === 1 ? "card" : "cards"}
                    </span>
                  </div>
                  <h2 className="user-deck-name">{deckDisplayName(deck)}</h2>
                  {cardCount > 0 && (
                    <p className="sr-deck-counts">
                      <span className="sr-count due">{dueCount} due</span>
                      <span className="sr-count new">{newCount} new</span>
                    </p>
                  )}
                </Link>
                <div className="user-deck-footer">
                  {cardCount === 0 ? (
                    <span className="sr-empty-deck">No cards yet</span>
                  ) : dueCount + newCount > 0 ? (
                    <Link to={`/spacedRepetition/${deck.deckId}`} className="user-deck-button study">
                      Study
                    </Link>
                  ) : (
                    <span className="sr-empty-deck">All caught up ✓</span>
                  )}
                  <Link
                    to={`/userDeck/${deck.deckId}/view?from=practice`}
                    className="user-deck-button primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SpacedRepetition;
