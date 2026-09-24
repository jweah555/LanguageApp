import "../pages/CreateCard.css";

import { useState } from "react";

const status = "Good"
const deckId = 7;
function CreateCard() {

  //These inputs must match backend fields for json
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [language, setLanguage] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    const card = {front, back, language, status}

    const response = await fetch("http://localhost:8080/card/7", {
      method: "POST",
      headers:{ "Content-Type": "application/json"},
      body: JSON.stringify(card),
      credentials: "include"
    });
    console.log(card)

    if(response.ok) {
      setBack("")
      setFront("")
      setLanguage("")
     
    }
    
  }



  return (
    <main>
      <div className="create-card-container">
        <h1>Create Card</h1>
        <form  onSubmit={handleSubmit} id="create-card">
          <input  placeholder=" Enter Card Name" className="card-name"></input>
          <input
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
            placeholder=" Enter Card Language"
            className="card-language"
          ></input>
          <textarea
            onChange={(e) => setFront(e.target.value)}
            value={front}
            placeholder=" Enter Source Language Text"
            className=""
          ></textarea>
          <textarea
            onChange={(e) => setBack(e.target.value)}
            value={back}
            placeholder=" Enter Translated Language Text "
            className=""
          ></textarea>
          <button onClick={handleSubmit} className="create-card-button" form="create-card">Create</button>
        </form>
      </div>
    </main>
  );
}

export default CreateCard;
