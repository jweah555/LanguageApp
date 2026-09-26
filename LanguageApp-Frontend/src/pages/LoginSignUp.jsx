import "../pages/LoginSignUp.css";
import grammerBook from "../assets/images/grammer2.png";
import { Link, Navigate, useNavigate } from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LANGUAGES } from "../utils/languages";
import { API_BASE } from "../utils/api.js";

function LoginSignUp({ initialMode = "signup" }) {
  const [mode, setMode] = useState(initialMode);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [language, setLanguage] = useState("");

  const [signInUserName, setSignInUserName] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!language) {
      alert("Please choose your native language.");
      return;
    }
    const user = { firstName, lastName, userName, password, role, language };

    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      try {
        await login(userName, password);
        navigate("/");
      } catch {
        alert("Account created! Please sign in.");
        setMode("signin");
      }
      setFirstName("");
      setLastName("");
      setUserName("");
      setPassword("");
      setRole("");
      setLanguage("");
    } else {
      const error = await response.text();
      alert("Registration failed: " + error);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await login(signInUserName, signInPassword);
      navigate("/");
    } catch {
      alert("Sign in failed: incorrect username or password.");
    }
  };

  return (
    <main>
      <section className="auth-container">
        <div className="auth-left-side">
          {mode === "signup" ? (
            <form className="auth-form">
              <h1 className="auth-h1">Sign Up</h1>
              <span className="please">
                Please login to continue to your account.
              </span>
              <input
                className="user-input"
                placeholder=" First Name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              ></input>
              <input
                className="user-input"
                placeholder=" Last Name"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              ></input>
              <label className="native-language">
                <span>Native language</span>
                <select
                  className="user-input user-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    The language you already speak
                  </option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </label>
              <input
                className="user-input"
                placeholder=" Role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              ></input>
              <input
                className="user-input"
                placeholder=" UserName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              ></input>
              <input
                className="user-password-input"
                placeholder=" Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button
                type="submit"
                onClick={handleRegister}
                className="sign-button"
              >
                Sign Up
              </button>

              <span className="please">
                Already have an account?{" "}
                <a onClick={() => setMode("signin")}>Sign in</a>
              </span>

              <Link to="/">
                <button className="sign-button">Return to Home Page</button>
              </Link>
            </form>
          ) : (
            <form className="auth-form">
              <h1 className="auth-h1">Sign In</h1>
              <span className="please">Welcome back!</span>
              <input
                className="user-input"
                placeholder=" UserName"
                type="text"
                value={signInUserName}
                onChange={(e) => setSignInUserName(e.target.value)}
              ></input>
              <input
                className="user-password-input"
                placeholder=" Password"
                type="password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              ></input>
              <button
                type="submit"
                onClick={handleSignIn}
                className="sign-button"
              >
                Sign In
              </button>

              <span className="please">
                Need an account?{" "}
                <a onClick={() => setMode("signup")}>Sign up</a>
              </span>

              <Link to="/">
                <button className="sign-button">Return to Home Page</button>
              </Link>
            </form>
          )}
        </div>
        <div className="auth-right-side">
          <img src={grammerBook} className="auth-image" />
        </div>
      </section>
    </main>
  );
}

export default LoginSignUp;
