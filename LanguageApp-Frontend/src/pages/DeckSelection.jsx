import "../pages/DeckSelection.css";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DeckSelection() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const decks = user.decks ?? [];

  return (
    <main className="card-page-main">
      <h1>Select the Deck of your Choice</h1>

      {decks.length === 0 ? (
        <p>You don't have any decks yet.</p>
      ) : (
        <div className="deck-card-container">
          {decks.map((deck) => (
            <div className="card-page" key={deck.deckId}>
              <h2 className="card-header">{deck.description}</h2>
              <p className="card-text">{deck.language}</p>
              <hr />
              <div className="card-bottom">
                <Link to="/userDeck">
                  <button className="card-button">Study</button>
                </Link>
                <span>{deck.cards.length} cards</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default DeckSelection;
