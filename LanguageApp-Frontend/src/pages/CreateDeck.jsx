import "../pages/CreateDeck.css";
import { useState } from "react";

function CreateDeck() {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("")
    } catch {
      
    }

  }


  return (
    <main>
      <div className="create-deck-container">
        <h1>Create Deck</h1>
        <form onSubmit={handleSubmit} id="create-deck">
          <input onChange={(e) => setName(e.target.value)} placeholder=" Enter Deck Name" className="deck-name"></input>
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
      </div>
    </main>
  );
}

export default CreateDeck;
