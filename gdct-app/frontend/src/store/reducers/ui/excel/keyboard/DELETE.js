import { getAllAreas } from '../tools/area';
import { CustomEditor, createEmptyEditorValue } from '../../../../../tools/slate';

const DELETE = state => {
  const {
    isEditMode,

    sheetCellData,
  } = state;

  if (isEditMode) return state;

  const newState = { ...state };

  const selectionAreaCoveredCells = getAllAreas(newState);

  const newSheetCellData = { ...sheetCellData };

  for (const row in selectionAreaCoveredCells) {
    const columns = Object.keys(selectionAreaCoveredCells[row]);

    const rowData = { ...newSheetCellData[row] };

    if (rowData) {
      columns.forEach(column => {
        // ! Consider when everything is undefined -- do you remove it from sheet data?
        // ! Consider normal/rich text

        if (rowData[column]) {
          rowData[column] = {
            ...rowData[column],
            value: undefined,
            type: 'normal',
          };
        }
      });

      newSheetCellData[row] = rowData;
    }
  }

  newState.sheetCellData = newSheetCellData;

  CustomEditor.clearEditor(newState.activeCellInputData.formulaEditor);
  CustomEditor.clearEditor(newState.activeCellInputData.cellEditor);

  newState.activeCellInputData = {
    ...newState.activeCellInputData,
    cellValue: createEmptyEditorValue(),
    formulaValue: createEmptyEditorValue(),
  };

  return newState;
};

export default DELETE;
