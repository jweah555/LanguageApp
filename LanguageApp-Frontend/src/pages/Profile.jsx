import "../pages/Profile.css";

import "../pages/CreateDeck.css";

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <main>
      <div className="profile-container">
        <h1>Your Profile</h1>
        <form className="profile-page">
          <input value={user.firstName} readOnly></input>
          <input value={user.lastName} readOnly></input>
          <input value={user.language} readOnly></input>
          <input value={`Role: ${user.role}`} readOnly></input>
          <input value={`Deck Count: ${user.decks?.length ?? 0}`} readOnly></input>
        </form>
        <button className="profile-button">Update Profile</button>
      </div>
    </main>
  );
}

export default Profile;
