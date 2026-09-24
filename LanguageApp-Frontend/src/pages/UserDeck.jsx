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
      <h1>Your Decks</h1>

      <Link to="/createDeck">
        <button className="card-button">Create Deck</button>
      </Link>

      <div className="deck-card-container">
        {decks.map((deck) => (
          <div className="card-page" key={deck.deckId}>
            <h2 className="card-header">{deck.description}</h2>
            <p className="card-text">{deck.language}</p>
            <hr />
            <div className="card-bottom">
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
