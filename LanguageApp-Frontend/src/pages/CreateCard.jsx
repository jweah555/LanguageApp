import "../pages/CreateForm.css";

import { useEffect, useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { deckDisplayName } from "../utils/deck";
import { LANGUAGES, toLanguageOption } from "../utils/languages";
import { useAuth } from "../context/AuthContext";

// Each row in "Multiple cards" mode needs a stable id for React keys
let nextRowId = 1;
const emptyRow = () => ({ id: nextRowId++, front: "", back: "" });

function CreateCard() {
  const { user, loading } = useAuth();
  const [decks, setDecks] = useState([]);
  const [mode, setMode] = useState("single"); // "single" or "multiple"

  //These inputs must match backend fields for json
  const [deckId, setDeckId] = useState("");
  const [language, setLanguage] = useState("");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [rows, setRows] = useState(() => [emptyRow(), emptyRow(), emptyRow()]);
  const [invalidRows, setInvalidRows] = useState([]); // ids of rows with only one side filled
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }
  const lastRowFront = useRef(null);

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
    // Older decks may have free-typed languages; only fill in ones that match an option
    const deckLanguage = toLanguageOption(selectedDeck?.language);
    if (deckLanguage) {
      setLanguage(deckLanguage);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage(null);
    setInvalidRows([]);
  };

  // The deck goes in the URL; the owner check uses the session cookie
  const postCard = (card) =>
    fetch(`http://localhost:8080/card/${deckId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
      credentials: "include",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await postCard({ language, front, back });

      if (!response.ok) {
        setMessage({ type: "error", text: "Could not create card: " + (await response.text()) });
        return;
      }
      setFront("");
      setBack("");
      setMessage({ type: "success", text: "Card created!" });
    } catch {
      setMessage({ type: "error", text: "Could not reach the server" });
    } finally {
      setSaving(false);
    }
  };

  // ---------- Multiple cards ----------

  const updateRow = (id, field, value) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
    setInvalidRows((current) => current.filter((rowId) => rowId !== id));
  };

  const addRow = () => {
    setRows((current) => [...current, emptyRow()]);
    // Focus the new row's front once it has rendered
    setTimeout(() => lastRowFront.current?.focus(), 0);
  };

  const removeRow = (id) => {
    setRows((current) => (current.length === 1 ? [emptyRow()] : current.filter((row) => row.id !== id)));
    setInvalidRows((current) => current.filter((rowId) => rowId !== id));
  };

  // Rows where both sides are filled in; fully empty rows are just skipped
  const filledRows = rows.filter((row) => row.front.trim() && row.back.trim());

  const handleSubmitMany = async (e) => {
    e.preventDefault();
    setMessage(null);

    const halfFilled = rows.filter((row) => !row.front.trim() !== !row.back.trim());
    if (halfFilled.length > 0) {
      setInvalidRows(halfFilled.map((row) => row.id));
      setMessage({ type: "error", text: "Fill in both the front and back of each card, or clear the row." });
      return;
    }
    if (filledRows.length === 0) {
      setMessage({ type: "error", text: "Add at least one card." });
      return;
    }

    setSaving(true);
    const failed = [];
    // Send one at a time so the cards keep the order they were typed in
    for (const row of filledRows) {
      try {
        const response = await postCard({ language, front: row.front.trim(), back: row.back.trim() });
        if (!response.ok) failed.push(row);
      } catch {
        failed.push(row);
      }
    }
    setSaving(false);

    const createdCount = filledRows.length - failed.length;
    if (failed.length === 0) {
      setRows([emptyRow(), emptyRow(), emptyRow()]);
      setMessage({
        type: "success",
        text: `${createdCount} ${createdCount === 1 ? "card" : "cards"} created!`,
      });
    } else {
      // Keep only the rows that didn't save so the user can retry them
      setRows(failed);
      setMessage({
        type: "error",
        text: `${createdCount} created, ${failed.length} failed. The failed ones are still below. Try again.`,
      });
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const deckAndLanguage = (
    <div className="create-row">
      <label className="create-field">
        <span>Deck</span>
        <select className="create-select" onChange={handleDeckChange} value={deckId} required>
          <option value="" disabled>
            Choose a deck
          </option>
          {decks.map((deck) => (
            <option key={deck.deckId} value={deck.deckId}>
              {deckDisplayName(deck)}
            </option>
          ))}
        </select>
      </label>
      <label className="create-field">
        <span>Language you're learning</span>
        <select
          className="create-select"
          onChange={(e) => setLanguage(e.target.value)}
          value={language}
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
    </div>
  );

  const messageBox = message && (
    <p className={`create-message ${message.type}`} role="status">
      {message.text}
    </p>
  );

  return (
    <div className="create-page">
      <div className={`create-card accent-teal${mode === "multiple" ? " wide" : ""}`}>
        <div className="create-header">
          <h1>{mode === "single" ? "Create a card" : "Create cards"}</h1>
          <p>
            {mode === "single"
              ? "Add a word or phrase to one of your decks."
              : "Add several cards at once. They will all go into the deck you choose."}
          </p>
        </div>

        <div className="create-mode" role="tablist" aria-label="How many cards">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "single"}
            className={mode === "single" ? "active" : ""}
            onClick={() => switchMode("single")}
          >
            Single card
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "multiple"}
            className={mode === "multiple" ? "active" : ""}
            onClick={() => switchMode("multiple")}
          >
            Multiple cards
          </button>
        </div>

        {mode === "single" ? (
          <form onSubmit={handleSubmit} className="create-form">
            {deckAndLanguage}

            <label className="create-field">
              <span>Front</span>
              <textarea
                onChange={(e) => setFront(e.target.value)}
                value={front}
                placeholder="Word or phrase in the language you're learning"
                rows={2}
                required
              />
            </label>
            <label className="create-field">
              <span>Back</span>
              <textarea
                onChange={(e) => setBack(e.target.value)}
                value={back}
                placeholder="Its meaning in your language"
                rows={2}
                required
              />
            </label>

            {/* Live preview of both sides of the card */}
            <div className="create-preview" aria-hidden="true">
              <div className="create-preview-face front">
                <small>Front</small>
                <p>{front || "Hola"}</p>
              </div>
              <div className="create-preview-face back">
                <small>Back</small>
                <p>{back || "Hello"}</p>
              </div>
            </div>

            {messageBox}

            <div className="create-actions">
              <Link to="/userDeck" className="create-btn secondary">
                Back to decks
              </Link>
              <button type="submit" className="create-btn primary" disabled={saving}>
                {saving ? "Creating…" : "Create card"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmitMany} className="create-form">
            {deckAndLanguage}

            <div className="create-list">
              <div className="create-list-row create-list-labels" aria-hidden="true">
                <span />
                <span>Front</span>
                <span>Back</span>
                <span />
              </div>
              {rows.map((row, i) => (
                <div
                  key={row.id}
                  className={`create-list-row${invalidRows.includes(row.id) ? " invalid" : ""}`}
                >
                  <span className="create-list-number">{i + 1}</span>
                  <input
                    ref={i === rows.length - 1 ? lastRowFront : null}
                    value={row.front}
                    onChange={(e) => updateRow(row.id, "front", e.target.value)}
                    placeholder="Hola"
                    aria-label={`Card ${i + 1} front`}
                  />
                  <input
                    value={row.back}
                    onChange={(e) => updateRow(row.id, "back", e.target.value)}
                    // Tab out of the last back field to get a fresh row
                    onKeyDown={(e) => {
                      if (e.key === "Tab" && !e.shiftKey && i === rows.length - 1) {
                        e.preventDefault();
                        addRow();
                      }
                    }}
                    placeholder="Hello"
                    aria-label={`Card ${i + 1} back`}
                  />
                  <button
                    type="button"
                    className="create-list-remove"
                    onClick={() => removeRow(row.id)}
                    aria-label={`Remove card ${i + 1}`}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button type="button" className="create-add-row" onClick={addRow}>
              + Add another card
            </button>

            {messageBox}

            <div className="create-actions">
              <Link to="/userDeck" className="create-btn secondary">
                Back to decks
              </Link>
              <button type="submit" className="create-btn primary" disabled={saving}>
                {saving
                  ? "Creating…"
                  : filledRows.length === 0
                    ? "Create cards"
                    : `Create ${filledRows.length} ${filledRows.length === 1 ? "card" : "cards"}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default CreateCard;
