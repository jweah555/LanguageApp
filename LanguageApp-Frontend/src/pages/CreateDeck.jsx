import "../pages/CreateDeck.css";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function CreateDeck() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
     const res = await fetch("http://localhost:8080/decks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ language, description }),
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
    <main>
      <div className="create-deck-container">
        <h1>Create Deck</h1>
        <form onSubmit={handleSubmit} id="create-deck">
          <input onChange={(e) => setLanguage(e.target.value)}
            placeholder=" Enter Deck Language"
            className="deck-language"
            required
          ></input>
          <input 
          onChange={(e) => setDescription(e.target.value)}
            placeholder=" Enter Deck Description"
            className="deck-description"
            required
          ></input>
          <button type="submit" className="create-deck-button">Create</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </main>
  );
}

export default CreateDeck;
