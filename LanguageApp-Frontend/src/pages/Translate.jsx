import "../pages/Translate.css";
import {useState} from "react";


function Translate() {
  const [text, setText] = useState("");
  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("EN-US");


  function handleClear() {
    setText("");
    setTranslation("");
  }
 

  async function handleTranslate() {
    if (!text.trim()) return;
    const res = await fetch("http://localhost:8080/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });
    
    const data = await res.json();
    setTranslation(data.translation);
    const a = data.translation;
    console.log(a);
    console.log(typeof(a));
    

  }

  

  return (
    <main>
      <section className="translate-container">
        <div className="translate-header">
          <label htmlFor="source-lang">Translate from</label>
          <select id="source-lang" value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
            <option value="">Language</option>
            <option value="EN">English 🇺🇸</option>
            <option value="ES">Spanish 🇪🇸</option>
            <option value="FR">French 🇫🇷</option>
          </select>
          <label htmlFor="target-lang">Translate to</label>
          <select id="target-lang" value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
            <option value="EN-US">English 🇺🇸</option>
            <option value="ES">Spanish 🇪🇸</option>
            <option value="FR">French 🇫🇷</option>
          </select>
        </div>
        <div className="left-right-translate">
          <div className="left-translate">
            <textarea
              placeholder="Type to Translate"
              value={text}
              // setText(e.target.value)
              onChange={(e) =>  {
                setText(e.target.value)
                
              } }
              
            />
            
          </div>
         
          <div className="right-translate">
            <textarea value={translation} readOnly placeholder="Translation" />
          </div>
          
        </div>
        <div className="translate-btns">
          <button className="translate-btn"   onClick={handleTranslate}>Translate</button>
          <button className="translate-btn"   onClick={handleClear}>Clear</button>
            
        </div>
         
      </section>
    </main>
  );
}

export default Translate;
