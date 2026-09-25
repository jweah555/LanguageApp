import "../pages/UserDeck.css";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function UserDeck() {
  const { user, loading } = useAuth();
  const [decks, setDecks] = useState([]);

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
    <main className="card-page-main">
      <div className="user-deck-header">
        <h1>Your Decks</h1>
        <Link to="/createDeck" className="create-deck-link">
          Create Deck
        </Link>
      </div>

      <div className="deck-card-container">
        {decks.map((deck) => (
          <div className="card-page" key={deck.deckId}>
            <Link to={`/userDeck/${deck.deckId}`} className="deck-open-link">
              <h2 className="card-header">{deck.deckName || deck.description}</h2>
              <p className="card-text">{deck.description}</p>
              <p className="card-text">{deck.language}</p>
            </Link>
            <hr />
            <div className="card-bottom">
              <Link to={`/userDeck/${deck.deckId}`}>
                <button className="card-button">View</button>
              </Link>
              <Link to="/createCard">
                <button className="card-button">Add</button>
              </Link>
              <span>{deck.cards.length} cards</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default UserDeck;
