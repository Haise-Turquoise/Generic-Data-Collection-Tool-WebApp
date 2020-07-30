const SET_SHEET_NAME = (state, { sheetName, newSheetName }) => {
  const { activeSheetName, sheetNames } = state;

  if (activeSheetName === newSheetName) {
    console.error(`Sheet name with name ${newSheetName} already exists`);
    return state;
  }

  const newState = { ...state };

  newState.sheetNames = sheetNames.map(name => (name === sheetName ? newSheetName : name));

  newState.activeSheetName = newSheetName;

  return newState;
};

export default SET_SHEET_NAME;
