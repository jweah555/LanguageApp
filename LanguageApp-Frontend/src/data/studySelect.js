import repeat from "../assets/images/repeat.png";
import flashCards from "../assets/images/flashCards.png";
import translation from "../assets/images/translation.png";
import grammer from "../assets/images/grammer2.png";

export const StudySelect = [
  {
    id: 1,
    image: repeat,
    text: "Spaced Rep Deck",
    pageLink: "/deckSelection",
  },
  {
    id: 2,
    image: flashCards,
    text: "Normal Prac Deck",
    pageLink: "/deckSelection",
  },
  {
    id: 3,
    image: translation,
    text: "Translation",
    pageLink: "/translate",
  },
  {
    id: 4,
    image: grammer,
    text: "Create Deck",
    pageLink: "/createDeck",
  },
];
