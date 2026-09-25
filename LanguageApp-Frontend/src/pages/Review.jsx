import "../pages/DeckCards.css";
import "../pages/Review.css";
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:8080";

// Left to right, worst to best; keys 1-4 pick them once the answer is showing
const RATINGS = [
  { value: "FORGOT", label: "Forgot" },
  { value: "HARD", label: "Hard" },
  { value: "MEDIUM", label: "Medium" },
  { value: "EASY", label: "Easy" },
];

// How many cards later a Hard/Forgot card comes back for practice
const REPEAT_GAP = 5;

function formatDays(days) {
  return days === 1 ? "1 day" : `${days} days`;
}

// Spaced repetition session: today's due cards, then new cards, one at a time
function Review() {
  const { deckId } = useParams(); // "all" studies every deck together
  const { user, loading } = useAuth();
  const [queue, setQueue] = useState(null); // null until loaded
  const [counts, setCounts] = useState({ due: 0, new: 0 });
  const [deckName, setDeckName] = useState("");
  const [showBack, setShowBack] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [error, setError] = useState("");

  const allDecks = deckId === "all";

  useEffect(() => {
    if (!user) return;

    const query = allDecks ? "" : `?deckId=${deckId}`;
    fetch(`${API_BASE}/review/session${query}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setQueue(data.cards.map((card) => ({ ...card, practice: false })));
        setCounts({ due: data.dueCount, new: data.newCount });
      })
      .catch(() => setError("Could not load today's cards"));

    if (!allDecks) {
      fetch(`${API_BASE}/decks/${deckId}`, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : null))
        .then((deck) => deck && setDeckName(deck.deckName || deck.description))
        .catch(() => {});
    }
  }, [user, deckId, allDecks]);

  const card = queue?.[0];

  async function rate(rating) {
    if (!card || !showBack || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/cards/${card.cardId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating }),
        credentials: "include",
      });
      if (!res.ok) throw new Error();

      const rest = queue.slice(1);
      if (rating === "HARD" || rating === "FORGOT") {
        // Show it again a few cards later; that repeat is practice only
        rest.splice(Math.min(REPEAT_GAP, rest.length), 0, { ...card, practice: true });
      }
      setQueue(rest);
      setShowBack(false);
      if (!card.practice) setReviewedCount((n) => n + 1);
    } catch {
      setError("Could not save your rating. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Space/Enter flips the card; 1-4 rate it once the answer is showing
  useEffect(() => {
    const handleKey = (e) => {
      if (!card) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setShowBack((current) => !current);
      }
      const choice = RATINGS[Number(e.key) - 1];
      if (choice && showBack) rate(choice.value);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const title = allDecks ? "All decks" : deckName || "Review";

  const header = (
    <div className="study-header">
      <div>
        <span className="study-language">Spaced repetition</span>
        <h1 className="study-title">{title}</h1>
      </div>
      <Link to="/spacedRepetition" className="study-link">
        &larr; Back
      </Link>
    </div>
  );

  if (queue === null) {
    return (
      <div className="study-page">
        {header}
        {error && (
          <div className="study-empty">
            <p>{error}</p>
          </div>
        )}
      </div>
    );
  }

  // Nothing was due today, or the session has been worked through
  if (!card) {
    const nothingToday = counts.due + counts.new === 0;
    return (
      <div className="study-page">
        {header}
        <div className="study-finished">
          <div className="study-finished-icon" aria-hidden="true">
            ✓
          </div>
          <h2>{nothingToday ? "Nothing left for today" : "Done for today!"}</h2>
          <p>
            {nothingToday
              ? "You're caught up or have reached today's limit. Come back tomorrow for your next cards."
              : `You reviewed ${reviewedCount} ${reviewedCount === 1 ? "card" : "cards"}. Each one is scheduled for its next review.`}
          </p>
          <div className="study-finished-actions">
            <Link to="/spacedRepetition" className="study-link">
              Back to Spaced Repetition
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const total = counts.due + counts.new;
  const badge = card.practice ? "Practice" : card.newCard ? "New" : "Review";

  return (
    <div className="study-page">
      {header}

      <div className="study-body">
        <div className="study-progress">
          <span className="study-count">
            {reviewedCount} of {total} done
          </span>
          <div className="study-progress-track">
            <div
              className="study-progress-fill"
              style={{ width: `${total ? (reviewedCount / total) * 100 : 0}%` }}
            />
          </div>
        </div>

        <p className="review-status">
          <span className={`review-badge ${badge.toLowerCase()}`}>{badge}</span>
          {card.practice
            ? "Extra practice. This won't change when the card is due."
            : allDecks && card.deckName}
        </p>

        {/* Flips only when clicked (or Space); no swiping here, the rating moves you on */}
        <button
          type="button"
          className="flip-card review-flip"
          onClick={() => setShowBack((current) => !current)}
          aria-label={showBack ? "Show front" : "Show answer"}
        >
          <div
            key={`${card.cardId}-${card.practice}`}
            className={`flip-card-inner${showBack ? " flipped" : ""}`}
          >
            <div className="flip-card-face flip-card-front">
              <span className="flip-card-label">Front</span>
              <p>{card.front}</p>
            </div>
            <div className="flip-card-face flip-card-back">
              <span className="flip-card-label">Back</span>
              <p>{card.back}</p>
            </div>
          </div>
        </button>

        {showBack ? (
          <div className="review-ratings">
            {RATINGS.map((rating, i) => (
              <button
                key={rating.value}
                type="button"
                className={`review-rating ${rating.value.toLowerCase()}`}
                onClick={() => rate(rating.value)}
                disabled={submitting}
              >
                <span className="review-rating-label">{rating.label}</span>
                <span className="review-rating-days">
                  {card.practice ? `Key ${i + 1}` : formatDays(card.previewDays[rating.value])}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <button type="button" className="deck-cards-flip" onClick={() => setShowBack(true)}>
            Show answer
          </button>
        )}

        {error && <p className="review-error">{error}</p>}

        <p className="deck-cards-hint">
          {showBack
            ? "How well did you remember it? Press 1–4 or pick a button"
            : "Click the card or press Space to see the answer"}
        </p>
      </div>
    </div>
  );
}

export default Review;
