import "../pages/CreateDeck.css";

function CreateDeck() {
  return (
    <main>
      <div className="create-deck-container">
        <h1>Create Deck</h1>
        <form id="create-deck">
          <input placeholder=" Enter Deck Name" className="deck-name"></input>
          <input
            placeholder=" Enter Deck Language"
            className="deck-language"
          ></input>
          <input
            placeholder=" Enter Deck Description"
            className="deck-description"
          ></input>
          <button className="create-deck-button">Create</button>
        </form>
      </div>
    </main>
  );
}

export default CreateDeck;
