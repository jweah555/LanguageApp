import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
// import "./styles/index.css";
// import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import DeckPage from "./pages/Decks.jsx";
import ErrorPage from "./pages/Error.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Translate from "./pages/Translate.jsx";
import LoginSignUp from "./pages/LoginSignUp.jsx";
import CreateDeck from "./pages/CreateDeck.jsx";
import CreateCard from "./pages/CreateCard.jsx";
import UserDeck from "./pages/UserDeck.jsx";
import DeckCards from "./pages/DeckCards.jsx";
import DeckView from "./pages/DeckView.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
// Loaded after the pages so dark mode overrides their styles
import "./styles/dark.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "deckpage", element: <DeckPage /> },
      { path: "deckSelection", element: <Navigate to="/userDeck" replace /> },
      { path: "translate", element: <Translate /> },
      { path: "loginSignUp", element: <LoginSignUp initialMode="signup" /> },
      { path: "login", element: <LoginSignUp initialMode="signin" /> },
      { path: "createDeck", element: <CreateDeck /> },
      { path: "createCard", element: <CreateCard /> },
      { path: "userDeck", element: <UserDeck /> },
      { path: "userDeck/:deckId", element: <DeckCards /> },
      { path: "userDeck/:deckId/view", element: <DeckView /> },
      { path: "profile", element: <Profile /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
