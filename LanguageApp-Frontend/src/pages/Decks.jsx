import "../pages/Decks.css";
import leftArrow from "../assets/images/left-arrow.png";
import rightArrow from "../assets/images/right-arrow.png";
function DeckPage() {
  return (
    <main className="deck-main">
      <section className="deck-section">
        <div>
          <h3>Spanish</h3>
        </div>
        <div className="card">
          <div className="due-new">
            <span> Due: 3</span>
            <span> New: 3</span>
          </div>
          <div className="translation">
            <p>
              Yo quiero entender por qué hay muchas cosas en mi casa que no
              quiero para nada y sé.
            </p>
          </div>
          <div className="bottom-options">
            <img src={leftArrow} />

            <span className="card-count">Card 3/8</span>

            <img src={rightArrow} />
          </div>
        </div>
      </section>
    </main>
  );
}

export default DeckPage;
