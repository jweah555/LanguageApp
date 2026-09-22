import "../Footer/Footer.css";
import mail from "../../assets/images/mail.gif";
// import atsign from "../../assets/images/atsign.gif";
import girlReading from "../../assets/images/girlReading.png";
// import reading from "../../assets/images/reading.png";
import relaxing from "../../assets/images/relaxing.png";
import boxPerson from "../../assets/images/boxPerson.png";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const isDeckSelectionPage = location.pathname === "/deckSelection";
  const isDeckPage = location.pathname === "/deckpage";
  const isTranslatePage = location.pathname === "/translate";
  const isLoginSignUpPage = location.pathname === "/loginSignUp";
  const isCreatePage = location.pathname === "/createDeck";
  const isCreateCardPage = location.pathname === "/createCard";
  const isUserDeck = location.pathname === "/userDeck";
  const isProfilePage = location.pathname === "/profile";

  return (
    <footer>
      {!isLoginSignUpPage && (
        <div className="footer-img">
          <img className="relaxing" src={relaxing} />
          <img className="reading" src={boxPerson} />
          <img className="girlReading" src={girlReading} />
        </div>
      )}

      {!isProfilePage &&
        !isUserDeck &&
        !isCreateCardPage &&
        !isCreatePage &&
        !isLoginSignUpPage &&
        !isDeckPage &&
        !isTranslatePage &&
        !isDeckSelectionPage && (
          <>
            <div className="right-left-container">
              <div className="left-side">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="170"
                    height="80"
                    viewBox="0 0 400 150"
                  >
                    <path
                      d="M30,20 h110 a20,20 0 0 1 20,20 v60 a20,20 0 0 1 -20,20 h-70 l-30,30 v-30 h-10 a20,20 0 0 1 -20,-20 v-60 a20,20 0 0 1 20,-20 z"
                      fill="#2196f3"
                    />

                    <circle cx="65" cy="65" r="6.5" fill="white" />
                    <circle cx="90" cy="65" r="6.5" fill="white" />
                    <circle cx="115" cy="65" r="6.5" fill="white" />

                    <text
                      x="160"
                      y="90"
                      font-family="Montserrat, Arial, sans-serif"
                      font-size="60"
                      font-weight="bold"
                      fill="#1e1e1e"
                    >
                      Deci
                    </text>
                  </svg>
                </div>
                <p>Making learning accesable and fun.</p>
              </div>
              <img src={mail} />

              <div className="right-side">
                <div className="input-sec">
                  <form>
                    <h3>Send Message</h3>
                    <div className="email-message">
                      <input placeholder=" First Name"></input>
                      <input placeholder=" Last Name"></input>
                    </div>
                    <input placeholder=" Email"></input>
                    <input placeholder=" Message"></input>
                    <button>Send</button>
                  </form>
                </div>
              </div>
            </div>
            <hr></hr>
            <div className="end">@ 2025 CopyRight</div>
          </>
        )}
    </footer>
  );
}

export default Footer;
