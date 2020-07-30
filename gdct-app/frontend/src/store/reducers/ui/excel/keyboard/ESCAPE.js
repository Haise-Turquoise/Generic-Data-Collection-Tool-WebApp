import {
  convertTextToEditorValue,
  convertRichTextToEditorValue,
  CustomEditor,
} from '../../../../../tools/slate';

const ESCAPE = state => {
  const {
    isEditMode,
    // isSheetFocused,
    activeCellInputData: { cellEditor, formulaEditor },
    sheetCellData,
    activeCellPosition: { x, y },
  } = state;

  if (!isEditMode) return state;

  const newState = { ...state };

  newState.isEditMode = false;

  const cellData = sheetCellData[y] && sheetCellData[y][x] ? sheetCellData[y][x] : undefined;

  const type = cellData ? cellData.type : undefined;
  const value = cellData ? cellData.value : undefined;

  let cellValue;
  let formulaValue;

  if (type === 'rich-text') {
    cellValue = convertRichTextToEditorValue(value);
    formulaValue = convertRichTextToEditorValue(value);
  } else {
    cellValue = convertTextToEditorValue(value);
    formulaValue = convertTextToEditorValue(value);
  }

  CustomEditor.clearEditor(formulaEditor);
  CustomEditor.clearEditor(cellEditor);

  newState.activeCellInputData = {
    ...newState.activeCellInputData,
    cellValue,
    formulaValue,
  };

  window.sheetContainerRef.current.focus();

  return newState;
};

export default ESCAPE;
