import "../pages/Translate.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Card languages are stored as names ("Spanish"), the translate API uses codes
const LANGUAGE_NAMES = { EN: "English", "EN-US": "English", ES: "Spanish", FR: "French" };


function Translate() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("EN-US");
  const { user } = useAuth();
  const [likedDeck, setLikedDeck] = useState(null);
  const [saveStatus, setSaveStatus] = useState(""); // "", "saving", "saved" or an error message

  // Find the user's default "Liked Cards" deck so translations can be saved to it
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:8080/decks/users/${user.usersId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((decks) => {
        // Newer accounts flag the deck as default; older ones only have the name
        const deck =
          decks.find((d) => d.default) ||
          decks.find((d) => (d.deckName || d.description) === "Liked Cards");
        setLikedDeck(deck ?? null);
      })
      .catch(() => setLikedDeck(null));
  }, [user]);


  function handleClear() {
    setText("");
    setTranslation("");
    setSaveStatus("");
  }

  // Saves the translation as a card: the translated text on the front
  // (the language being learned) and the original text on the back
  async function handleSaveToLiked() {
    if (!likedDeck) {
      setSaveStatus("Could not find your Liked Cards deck");
      return;
    }
    setSaveStatus("saving");
    try {
      const res = await fetch(`http://localhost:8080/card/${likedDeck.deckId}`, {
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
 

  async function handleTranslate() {
    if (!text.trim()) return;
    const res = await fetch("http://localhost:8080/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });
    
    const data = await res.json();
    setTranslation(data.translation);
    setSaveStatus("");
    const a = data.translation;
    console.log(a);
    console.log(typeof(a));
    

  }

  

  return (
    <div className="translate-page">
      <div className="translate-intro">
        <h1 className="translate-title">Translate</h1>
        <p className="translate-subtitle">
          Type a word or phrase and see it in another language.
        </p>
      </div>

      <section className="translate-card">
        <div className="translate-langs">
          <div className="translate-lang">
            <label htmlFor="source-lang">From</label>
            <select
              id="source-lang"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              <option value="">Detect language</option>
              <option value="EN">English 🇺🇸</option>
              <option value="ES">Spanish 🇪🇸</option>
              <option value="FR">French 🇫🇷</option>
            </select>
          </div>
          <span className="translate-arrow" aria-hidden="true">
            &rarr;
          </span>
          <div className="translate-lang">
            <label htmlFor="target-lang">To</label>
            <select
              id="target-lang"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              <option value="EN-US">English 🇺🇸</option>
              <option value="ES">Spanish 🇪🇸</option>
              <option value="FR">French 🇫🇷</option>
            </select>
          </div>
        </div>

        <div className="translate-panels">
          <textarea
            className="translate-input"
            placeholder="Type to translate"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <textarea
            className="translate-output"
            value={translation}
            readOnly
            placeholder="Translation"
          />
        </div>

        <div className="translate-btns">
          {translation && (
            <div className="translate-save">
              {user ? (
                <button
                  className="translate-btn like"
                  onClick={handleSaveToLiked}
                  disabled={saveStatus === "saving" || saveStatus === "saved"}
                >
                  {saveStatus === "saved"
                    ? "♥ Added to Liked Cards"
                    : saveStatus === "saving"
                      ? "Adding…"
                      : "♡ Add to Liked Cards"}
                </button>
              ) : (
                <Link to="/login" className="translate-login">
                  Log in to save this translation
                </Link>
              )}
              {saveStatus && saveStatus !== "saving" && saveStatus !== "saved" && (
                <span className="translate-save-error">{saveStatus}</span>
              )}
            </div>
          )}
          <button className="translate-btn clear" onClick={handleClear}>
            Clear
          </button>
          <button className="translate-btn primary" onClick={handleTranslate}>
            Translate
          </button>
        </div>
      </section>
    </div>
  );
}

export default Translate;
