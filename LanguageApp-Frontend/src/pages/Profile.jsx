import "../pages/Profile.css";

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES, toLanguageOption } from "../utils/languages";

const API_BASE = "http://localhost:8080";

function Profile() {
  const { user, loading, setUser } = useAuth();
  const [decks, setDecks] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", language: "" });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  // Load decks so the stats reflect the latest deck and card counts
  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE}/decks/users/${user.usersId}`, { credentials: "include" })
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

  const cardCount = decks.reduce((total, deck) => total + (deck.cards?.length ?? 0), 0);
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const startEditing = () => {
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      language: toLanguageOption(user.language),
    });
    setMessage(null);
    setEditing(true);
  };

  const handleChange = (e) => {
    setForm((current) => ({ ...current, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE}/users/${user.usersId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });
      if (!res.ok) {
        setMessage({ type: "error", text: (await res.text()) || "Could not update your profile" });
        return;
      }
      setUser(await res.json());
      setEditing(false);
      setMessage({ type: "success", text: "Profile updated" });
    } catch {
      setMessage({ type: "error", text: "Could not update your profile" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <section className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          {initials || "?"}
        </div>
        <div>
          <h1 className="profile-name">
            {user.firstName} {user.lastName}
          </h1>
          <p className="profile-username">@{user.userName}</p>
          <div className="profile-tags">
            {user.language && <span className="profile-tag language">{user.language}</span>}
            {user.role && <span className="profile-tag role">{user.role}</span>}
          </div>
        </div>
      </section>

      <section className="profile-stats">
        <div className="profile-stat">
          <span className="profile-stat-value">{decks.length}</span>
          <span className="profile-stat-label">{decks.length === 1 ? "Deck" : "Decks"}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value">{cardCount}</span>
          <span className="profile-stat-label">{cardCount === 1 ? "Card" : "Cards"}</span>
        </div>
        <div className="profile-stat">
          <span className="profile-stat-value small">{user.language || "—"}</span>
          <span className="profile-stat-label">Native language</span>
        </div>
      </section>

      <section className="profile-details">
        <div className="profile-details-header">
          <h2>Account details</h2>
          {!editing && (
            <button type="button" className="profile-btn primary" onClick={startEditing}>
              Edit profile
            </button>
          )}
        </div>

        {message && (
          <p className={`profile-message ${message.type}`} role="status">
            {message.text}
          </p>
        )}

        {editing ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label className="profile-field">
              <span>First name</span>
              <input name="firstName" value={form.firstName} onChange={handleChange} required />
            </label>
            <label className="profile-field">
              <span>Last name</span>
              <input name="lastName" value={form.lastName} onChange={handleChange} required />
            </label>
            <label className="profile-field">
              <span>Native language</span>
              <select
                name="language"
                className="profile-select"
                value={form.language}
                onChange={handleChange}
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
            <label className="profile-field">
              <span>Username</span>
              <input value={user.userName} disabled />
              <small>Your username can't be changed.</small>
            </label>

            <div className="profile-form-actions">
              <button
                type="button"
                className="profile-btn secondary"
                onClick={() => {
                  setEditing(false);
                  setMessage(null);
                }}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="profile-btn primary" disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        ) : (
          <dl className="profile-list">
            <div>
              <dt>First name</dt>
              <dd>{user.firstName}</dd>
            </div>
            <div>
              <dt>Last name</dt>
              <dd>{user.lastName}</dd>
            </div>
            <div>
              <dt>Username</dt>
              <dd>{user.userName}</dd>
            </div>
            <div>
              <dt>Native language</dt>
              <dd>{user.language}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{user.role}</dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}

export default Profile;
