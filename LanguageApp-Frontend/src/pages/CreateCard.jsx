import "../pages/CreateCard.css";

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateCard() {
  const { user, loading } = useAuth();
  const [decks, setDecks] = useState([]);

  //These inputs must match backend fields for json
  const [deckId, setDeckId] = useState("");
  const [language, setLanguage] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [message, setMessage] = useState("");

  // Load the logged-in user's decks so they can pick which one the card goes in
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/decks/users/${user.usersId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setDecks(data))
      .catch(() => setDecks([]));
  }, [user]);

  // Picking a deck fills in its language, which the user can still change
  const handleDeckChange = (e) => {
    const selectedId = e.target.value;
    setDeckId(selectedId);
    const selectedDeck = decks.find((deck) => String(deck.deckId) === selectedId);
    if (selectedDeck && selectedDeck.language) {
      setLanguage(selectedDeck.language);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = { language, front, back };

    try {
      // The deck goes in the URL; the owner check uses the session cookie
      const response = await fetch(`http://localhost:8080/card/${deckId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(card),
        credentials: "include",
      });

      if (!response.ok) {
        setMessage("Could not create card: " + (await response.text()));
        return;
      }
      setFront("");
      setBack("");
      setMessage("Card created!");
    } catch {
      setMessage("Could not reach the server");
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main>
      <div className="create-card-container">
        <h1>Create Card</h1>
        <form onSubmit={handleSubmit} id="create-card">
          <select
            onChange={handleDeckChange}
            value={deckId}
            className="card-deck"
            required
          >
            <option value="" disabled>
              Choose a deck
            </option>
            {decks.map((deck) => (
              <option key={deck.deckId} value={deck.deckId}>
                {deck.description}
              </option>
            ))}
          </select>
          <input
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            placeholder=" Enter Card Language"
            className="card-language"
            required
          ></input>
          <textarea
            onChange={(e) => setFront(e.target.value)}
            value={front}
            placeholder=" Enter word or phrase in the language you're learning"
            required
          ></textarea>
          <textarea
            onChange={(e) => setBack(e.target.value)}
            value={back}
            placeholder=" Enter its meaning in your language"
            required
          ></textarea>
          <button type="submit" className="create-card-button">Create</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </main>
  );
}

export default CreateCard;
