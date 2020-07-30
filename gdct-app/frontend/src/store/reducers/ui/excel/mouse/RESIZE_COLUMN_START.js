import { getNormalColumnWidth } from '../../../../../tools/excel';

const RESIZE_COLUMN_START = (state, { column, leftOffsets }) => {
  const newState = { ...state };

  const { sheetColumnWidths } = newState;

  const width = getNormalColumnWidth(sheetColumnWidths[column]);
  const columnOffset = leftOffsets[column];
  const offset = columnOffset + width;

  newState.isColumnResizeMode = true;
  newState.columnResizeData = { column, offset };
  newState.cursorType = 'ew-resize';

  return newState;
};

export default RESIZE_COLUMN_START;
