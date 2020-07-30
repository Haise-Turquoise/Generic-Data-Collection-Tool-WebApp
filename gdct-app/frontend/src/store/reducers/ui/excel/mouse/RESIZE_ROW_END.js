import { getNormalRowHeight, getExcelRowHeight } from '../../../../../tools/excel';

import { DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER } from '../../../../../constants/excel';

const RESIZE_ROW_END = (state, { topOffsets }) => {
  const newState = { ...state };

  const {
    rowResizeData,
    sheetFreezeRowCount,

    sheetRowHeights,
    scrollData,
  } = newState;

  newState.cursorType = 'default';

  const { row, offset } = rowResizeData;
  const rowTopOffset = topOffsets[row];
  const { scrollTop } = scrollData;

  const sheetFreezeRowEndOffset =
    topOffsets[sheetFreezeRowCount] +
    (sheetFreezeRowCount
      ? getNormalRowHeight(sheetRowHeights[sheetFreezeRowCount])
      : DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER);

  const rowHeight = getNormalRowHeight(sheetRowHeights[row]);
  const currentOffset = rowTopOffset + rowHeight;

  let newRowHeight = offset - rowTopOffset;

  if (row <= sheetFreezeRowCount && offset > sheetFreezeRowEndOffset) newRowHeight -= scrollTop;

  if (offset !== currentOffset) {
    newState.sheetRowHeights = {
      ...sheetRowHeights,
      [row]: getExcelRowHeight(newRowHeight),
    };
    window.sheetGridRef.current.resetAfterRowIndex(row);
  }

  newState.isRowResizeMode = false;
  newState.rowResizeData = null;

  return newState;
};

export default RESIZE_ROW_END;
