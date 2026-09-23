import "../pages/CreateCard.css";

import { useState } from "react";

const status = "Good"
const userId = 6;
function CreateCard() {

  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const [cardLanguage, setCardLanguage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = {cardFront, cardBack, cardLangauge, status, userId}

    const response = await fetch("http://localhost:8080/", {
      method: "POST",
      headers:{ "Content-Type": "application/json"},
      body: JSON.stringify(card),
    });
    
  }



  return (
    <main>
      <div className="create-card-container">
        <h1>Create Card</h1>
        <form  onSubmit={handleSubmit} id="create-card">
          <input  placeholder=" Enter Card Name" className="card-name"></input>
          <input
            onChange={(e) => setCardLanguage(e.target.value)}
            value={cardLanguage}
            placeholder=" Enter Card Language"
            className="card-language"
          ></input>
          <textarea
            onChange={(e) => setCardFront(e.target.value)}
            value={cardFront}
            placeholder=" Enter Source Language Text"
            className=""
          ></textarea>
          <textarea
            onChange={(e) => setCardBack(e.target.value)}
            value={cardBack}
            placeholder=" Enter Translated Language Text "
            className=""
          ></textarea>
          <button className="create-card-button" form="card-card">Create</button>
        </form>
      </div>
    </main>
  );
}

export default CreateCard;
