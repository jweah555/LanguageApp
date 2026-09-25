import "./QuickTranslate.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SOURCE_LANGUAGES, TARGET_LANGUAGES, useTranslator } from "../../hooks/useTranslator";

// Floating button in the bottom-right corner that opens a small translate panel
function QuickTranslate() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
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

  // Focus the text box on open; Escape closes the panel
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  const saveError = saveStatus && saveStatus !== "saving" && saveStatus !== "saved";

  return (
    <div className="quick-translate">
      {open && (
        <section className="qt-panel" role="dialog" aria-label="Quick translate">
          <div className="qt-header">
            <h2>Quick translate</h2>
            <button
              type="button"
              className="qt-close"
              onClick={() => setOpen(false)}
              aria-label="Close quick translate"
            >
              ×
            </button>
          </div>

          <div className="qt-langs">
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              aria-label="Translate from"
            >
              {SOURCE_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
            <span aria-hidden="true">&rarr;</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              aria-label="Translate to"
            >
              {TARGET_LANGUAGES.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <textarea
            ref={inputRef}
            className="qt-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            // Enter translates, Shift+Enter adds a new line
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                translate();
              }
            }}
            placeholder="Type a word or phrase…"
            rows={2}
          />

          <div className="qt-output" aria-live="polite">
            {translating ? (
              <span className="qt-placeholder">Translating…</span>
            ) : translation ? (
              translation
            ) : (
              <span className="qt-placeholder">Translation appears here</span>
            )}
          </div>

          {error && <p className="qt-error">{error}</p>}
          {saveError && <p className="qt-error">{saveStatus}</p>}

          <div className="qt-actions">
            {translation &&
              (user ? (
                <button
                  type="button"
                  className="qt-btn like"
                  onClick={saveToLiked}
                  disabled={saveStatus === "saving" || saveStatus === "saved"}
                >
                  {saveStatus === "saved" ? "♥ Saved" : saveStatus === "saving" ? "Saving…" : "♡ Save"}
                </button>
              ) : (
                <Link to="/login" className="qt-login" onClick={() => setOpen(false)}>
                  Log in to save
                </Link>
              ))}
            <button type="button" className="qt-btn clear" onClick={clear}>
              Clear
            </button>
            <button
              type="button"
              className="qt-btn primary"
              onClick={translate}
              disabled={translating || !text.trim()}
            >
              Translate
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        className={`qt-fab${open ? " open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close quick translate" : "Open quick translate"}
        aria-expanded={open}
        title="Quick translate"
      >
        {open ? (
          <span className="qt-fab-close" aria-hidden="true">
            ×
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

export default QuickTranslate;
