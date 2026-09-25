import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deckDisplayName } from "../utils/deck";

const API_BASE = "http://localhost:8080";

export const SOURCE_LANGUAGES = [
  { value: "", label: "Detect language" },
  { value: "EN", label: "English 🇺🇸" },
  { value: "ES", label: "Spanish 🇪🇸" },
  { value: "FR", label: "French 🇫🇷" },
];

export const TARGET_LANGUAGES = [
  { value: "EN-US", label: "English 🇺🇸" },
  { value: "ES", label: "Spanish 🇪🇸" },
  { value: "FR", label: "French 🇫🇷" },
];

// Card languages are stored as names ("Spanish"), the translate API uses codes
const LANGUAGE_NAMES = { EN: "English", "EN-US": "English", ES: "Spanish", FR: "French" };

// Shared by the Translate page and the floating quick-translate widget:
// translating text and saving the result to the user's Liked Cards deck.
export function useTranslator() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("EN-US");
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved" or an error message

  async function translate() {
    if (!text.trim()) return;
    setTranslating(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sourceLang, targetLang }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTranslation(data.translation);
      setSaveStatus("");
    } catch {
      setError("Could not translate right now");
    } finally {
      setTranslating(false);
    }
  }

  function clear() {
    setText("");
    setTranslation("");
    setError("");
    setSaveStatus("");
  }

  // Saves the translation as a card: the translated text on the front
  // (the language being learned) and the original text on the back
  async function saveToLiked() {
    setSaveStatus("saving");
    try {
      // Look the deck up when saving, so a widget sitting on every page doesn't fetch on load
      const decksRes = await fetch(`${API_BASE}/decks/users/${user.usersId}`, {
        credentials: "include",
      });
      const decks = decksRes.ok ? await decksRes.json() : [];
      // Newer accounts flag the deck as default; older ones only have the name
      const likedDeck =
        decks.find((d) => d.default) || decks.find((d) => deckDisplayName(d) === "Liked Cards");
      if (!likedDeck) {
        setSaveStatus("Could not find your Liked Cards deck");
        return;
      }

      const res = await fetch(`${API_BASE}/card/${likedDeck.deckId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: LANGUAGE_NAMES[targetLang] ?? targetLang,
          front: translation,
          back: text,
        }),
        credentials: "include",
      });
      setSaveStatus(res.ok ? "saved" : "Could not save this card");
    } catch {
      setSaveStatus("Could not save this card");
    }
  }

  return {
    user,
    text,
    setText,
    translation,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    translating,
    error,
    translate,
    clear,
    saveStatus,
    saveToLiked,
  };
}
