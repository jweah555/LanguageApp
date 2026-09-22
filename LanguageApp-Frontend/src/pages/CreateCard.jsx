import "../pages/CreateCard.css";

function CreateCard() {
  return (
    <main>
      <div className="create-card-container">
        <h1>Create Card</h1>
        <form id="create-card">
          <input placeholder=" Enter Card Name" className="card-name"></input>
          <input
            placeholder=" Enter Card Language"
            className="card-language"
          ></input>
          <textarea
            placeholder=" Enter Source Language Text"
            className=""
          ></textarea>
          <textarea
            placeholder=" Enter Translated Language Text "
            className=""
          ></textarea>
          <button className="create-card-button">Create</button>
        </form>
      </div>
    </main>
  );
}

export default CreateCard;
