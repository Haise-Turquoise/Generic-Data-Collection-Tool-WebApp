import cloneDeep from 'clone-deep';

const SET_ACTIVE_CELL_INPUT_VALUE = (state, { value, input }) => {
  const newState = { ...state };

  // newState.activeCellAutoFocus = input === "formula" ? false : true;

  newState.isEditMode = true;

  newState.activeCellInputData = {
    ...newState.activeCellInputData,
    formulaValue: cloneDeep(value),
    cellValue: cloneDeep(value),

    // formulaValue: [ ...value ],
    // cellValue: [ ...value ]
  };

  return newState;
};

export default SET_ACTIVE_CELL_INPUT_VALUE;
