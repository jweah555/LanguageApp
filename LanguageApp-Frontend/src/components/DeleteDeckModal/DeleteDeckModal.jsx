import "./DeleteDeckModal.css";
import { useEffect, useRef, useState } from "react";
import { deckDisplayName } from "../../utils/deck";

function DeleteDeckModal({ deck, onClose, onDeleted }) {
  const name = deckDisplayName(deck);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const matches = typed.trim() === name;

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!matches) return;

    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:8080/decks/${deck.deckId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        setError((await res.text()) || "Could not delete this deck");
        setDeleting(false);
        return;
      }
      onDeleted(deck.deckId);
    } catch {
      setError("Could not delete this deck");
      setDeleting(false);
    }
  };

  const cardCount = deck.cards?.length ?? 0;

  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <form
        className="delete-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleDelete}
      >
        <h2 id="delete-modal-title">Delete this deck?</h2>
        <p className="delete-modal-warning">
          This will permanently delete <strong>{name}</strong> and its{" "}
          {cardCount} {cardCount === 1 ? "card" : "cards"}. This can't be undone.
        </p>

        <label htmlFor="delete-modal-input" className="delete-modal-label">
          Type <strong>{name}</strong> to confirm
        </label>
        <input
          id="delete-modal-input"
          ref={inputRef}
          className="delete-modal-input"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          autoComplete="off"
          spellCheck="false"
        />

        {error && <p className="delete-modal-error">{error}</p>}

        <div className="delete-modal-actions">
          <button type="button" className="delete-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="delete-modal-confirm"
            disabled={!matches || deleting}
          >
            {deleting ? "Deleting…" : "Delete deck"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeleteDeckModal;
