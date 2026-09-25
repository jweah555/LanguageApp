import "../pages/DeckCards.css";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import leftArrow from "../assets/images/left-arrow.png";
import rightArrow from "../assets/images/right-arrow.png";

// How far (in px) a finger has to move sideways to count as a swipe
const SWIPE_DISTANCE = 50;

function DeckCards() {
  const { deckId } = useParams();
  const { user, loading } = useAuth();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [message, setMessage] = useState("");
  const swipeStartX = useRef(null);

  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/decks/${deckId}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        setDeck(data);
        // Cards come back as a set, so sort them to keep the order stable
        setCards([...data.cards].sort((a, b) => a.cardId - b.cardId));
      })
      .catch(() => setMessage("Could not load this deck"));
  }, [user, deckId]);

  const goTo = (newIndex) => {
    if (newIndex < 0 || newIndex >= cards.length) return;
    setIndex(newIndex);
    setShowBack(false);
  };

  // Left/right arrow keys move between cards, Space flips
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === " ") {
        e.preventDefault(); // stop the page from scrolling
        setShowBack((current) => !current);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  const handleSwipeStart = (e) => {
    swipeStartX.current = e.clientX;
  };

  const handleSwipeEnd = (e) => {
    if (swipeStartX.current === null) return;
    const distance = e.clientX - swipeStartX.current;
    swipeStartX.current = null;

    if (distance <= -SWIPE_DISTANCE) {
      goTo(index + 1);
    } else if (distance >= SWIPE_DISTANCE) {
      goTo(index - 1);
    } else {
      // A tap (no real swipe) flips the card
      setShowBack((current) => !current);
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (message) {
    return (
      <div className="study-page">
        <div className="study-empty">
          <p>{message}</p>
          <Link to="/userDeck" className="study-link">
            Back to decks
          </Link>
        </div>
      </div>
    );
  }

  if (!deck) {
    return null;
  }

  const card = cards[index];

  return (
    <div className="study-page">
      <div className="study-header">
        <div>
          {deck.language && <span className="study-language">{deck.language}</span>}
          <h1 className="study-title">{deck.deckName || deck.description}</h1>
        </div>
        <Link to="/userDeck" className="study-link">
          &larr; Back to decks
        </Link>
      </div>

      {cards.length === 0 ? (
        <div className="study-empty">
          <h2>This deck has no cards yet</h2>
          <p>Add a few cards and come back to study them.</p>
          <Link to="/createCard" className="study-link">
            + Add a card
          </Link>
        </div>
      ) : (
        <div className="study-body">
          <div className="study-progress">
            <span className="study-count">
              Card {index + 1} of {cards.length}
            </span>
            <div className="study-progress-track">
              <div
                className="study-progress-fill"
                style={{ width: `${((index + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>

          <div
            className="flip-card deck-cards-swipe"
            onPointerDown={handleSwipeStart}
            onPointerUp={handleSwipeEnd}
            onPointerCancel={() => (swipeStartX.current = null)}
          >
            {/* key makes a new card start on its front without animating */}
            <div
              key={card.cardId}
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
          </div>

          <div className="study-controls">
            <button
              className="deck-cards-arrow"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous card"
            >
              <img src={leftArrow} alt="" />
            </button>

            <button
              className="deck-cards-flip"
              onClick={() => setShowBack((current) => !current)}
            >
              Flip
            </button>

            <button
              className="deck-cards-arrow"
              onClick={() => goTo(index + 1)}
              disabled={index === cards.length - 1}
              aria-label="Next card"
            >
              <img src={rightArrow} alt="" />
            </button>
          </div>

          <p className="deck-cards-hint">
            Tap the card or press Space to flip &middot; swipe or use the arrow keys to move
          </p>
        </div>
      )}
    </div>
  );
}

export default DeckCards;
