const ADD_SHEET = (state, { sheetName, sheetData }) => {
  const { activeSheetName, sheetNames } = state;

  const newState = { ...state };

  newState.inactiveSheets[sheetName] = sheetData;

  const activeSheetNameIndex = sheetNames.indexOf(activeSheetName);

  newState.sheetNames = [
    ...sheetNames.slice(0, activeSheetNameIndex + 1),
    sheetName,
    ...sheetNames.slice(activeSheetNameIndex + 1),
  ];

  // TODO CHANGE SHEET HERE

  return newState;
};

export default ADD_SHEET;
