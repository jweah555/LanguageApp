import "../pages/Translate.css";
import { Link } from "react-router-dom";
import { SOURCE_LANGUAGES, TARGET_LANGUAGES, useTranslator } from "../hooks/useTranslator";

function Translate() {
  const {
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
  } = useTranslator();

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
              {SOURCE_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
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
              {TARGET_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
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
                  onClick={saveToLiked}
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
          {error && <span className="translate-save-error">{error}</span>}
          <button className="translate-btn clear" onClick={clear}>
            Clear
          </button>
          <button className="translate-btn primary" onClick={translate} disabled={translating}>
            {translating ? "Translating…" : "Translate"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Translate;
