import "../pages/Translate.css";

function Translate() {
  return (
    <main>
      <section className="translate-container">
        <div className="translate-header">
          <label for="translate-text">Select Language</label>
          <select name="translate-text">
            <option value="English"> English 🇺🇸 </option>
            <option value="Spanish"> Spanish 🇪🇸</option>
            <option value="French"> French 🇫🇷</option>
          </select>
          <label for="traslated-text"> Translate to English</label>
          <select name="traslated-text">
            <option value="English"> English 🇺🇸 </option>
            <option value="Spanish"> Spanish 🇪🇸</option>
            <option value="French"> French 🇫🇷</option>
          </select>
        </div>
        <div className="left-right-translate">
          <div className="left-translate">
            <input placeholder="Type to Translate"></input>
          </div>
          <div className="right-translate">
            <input></input>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Translate;
