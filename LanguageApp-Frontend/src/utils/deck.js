// The name shown for a deck everywhere in the app, which is also what the user types to delete it
export function deckDisplayName(deck) {
  return deck.deckName || deck.description || `Deck ${deck.deckId}`;
}

// The Liked Cards deck holds saved translations, so it can't be deleted
export function isLikedDeck(deck) {
  return deck.default || deckDisplayName(deck) === "Liked Cards";
}
