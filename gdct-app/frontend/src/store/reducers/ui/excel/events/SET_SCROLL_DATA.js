const SET_SCROLL_DATA = (state, { scrollData }) => {
  const newState = { ...state };

  newState.scrollData = { ...newState.scrollData, ...scrollData };

  return newState;
};

export default SET_SCROLL_DATA;
