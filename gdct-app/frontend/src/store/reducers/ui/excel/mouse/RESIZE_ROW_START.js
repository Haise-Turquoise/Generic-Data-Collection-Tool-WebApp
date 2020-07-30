import { getNormalRowHeight } from '../../../../../tools/excel';

const RESIZE_ROW_START = (state, { row, topOffsets }) => {
  const newState = { ...state };

  const { sheetRowHeights } = newState;

  const height = getNormalRowHeight(sheetRowHeights[row]);
  const rowOffset = topOffsets[row];
  const offset = rowOffset + height;

  newState.isRowResizeMode = true;
  newState.rowResizeData = { row, offset };
  newState.cursorType = 'ns-resize';

  return newState;
};

export default RESIZE_ROW_START;
