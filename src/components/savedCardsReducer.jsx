export const actionTypes = {
  ADD_CARD: "ADD_CARD",
  REMOVE_CARD: "REMOVE_CARD",
};

const loadSavedCards = () => {
  const savedCards = localStorage.getItem("savedCards");
  return savedCards ? JSON.parse(savedCards) : [];
};

export const initialState = {
  savedCards: loadSavedCards(),
};

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_CARD:
      const isCardAlreadySaved = state.savedCards.some(
        (card) => card.id === action.payload.id
      );
      if (isCardAlreadySaved) return state;
      const updatedSavedCardsAdd = [...state.savedCards, action.payload];
      localStorage.setItem("savedCards", JSON.stringify(updatedSavedCardsAdd));
      return {
        ...state,
        savedCards: updatedSavedCardsAdd,
      };

    case actionTypes.REMOVE_CARD:
      const updatedSavedCardsRemove = state.savedCards.filter(
        (card) => card.id !== action.payload
      );
      localStorage.setItem(
        "savedCards",
        JSON.stringify(updatedSavedCardsRemove)
      );
      return {
        ...state,
        savedCards: updatedSavedCardsRemove,
      };

    default:
      return state;
  }
};
