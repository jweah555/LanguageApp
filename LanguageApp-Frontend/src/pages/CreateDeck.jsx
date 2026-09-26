import "../pages/CreateForm.css";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../utils/languages";
import { API_BASE } from "../utils/api.js";

function CreateDeck() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [deckName, setDeckName] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
     const res = await fetch(`${API_BASE}/decks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deckName, language, description }),
      });
      if (!res.ok) {
        setMessage("Could not create deck: " + (await res.text()));
        return;
      }
      navigate("/userDeck");
    } catch {
      setMessage("Could not reach the server");
    }
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }


  return (
    <div className="create-page">
      <div className="create-card accent-sky">
        <div className="create-header">
          <h1>Create a deck</h1>
          <p>Group your flashcards by topic or language.</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          <label className="create-field">
            <span>Deck name</span>
            <input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="e.g. Spanish Basics"
              required
            />
          </label>
          <label className="create-field">
            <span>Language you're learning</span>
            <select
              className="create-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
            >
              <option value="" disabled>
                Choose a language
              </option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </label>
          <label className="create-field">
            <span>Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this deck for?"
              rows={3}
              required
            />
          </label>

          {message && <p className="create-message error">{message}</p>}

          <div className="create-actions">
            <Link to="/userDeck" className="create-btn secondary">
              Cancel
            </Link>
            <button type="submit" className="create-btn primary">
              Create deck
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateDeck;
