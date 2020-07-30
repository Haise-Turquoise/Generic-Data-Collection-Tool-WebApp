import { getScrollbarSize, getNormalColumnWidth } from '../../../../../tools/excel';

import { DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER } from '../../../../../constants/excel';

const RESIZE_COLUMN = (state, { xOffset, leftOffsets }) => {
  const newState = { ...state };

  const {
    sheetColumnWidths,
    sheetFreezeColumnCount,
    columnResizeData,
    scrollData: { scrollLeft },
  } = newState;

  const { column } = columnResizeData;
  const columnOffset = leftOffsets[column];
  const freezeColumnOffset =
    leftOffsets[sheetFreezeColumnCount] +
    (sheetFreezeColumnCount
      ? getNormalColumnWidth(sheetColumnWidths[sheetFreezeColumnCount])
      : DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER);

  const { clientWidth } = window.sheetContainerRef.current;

  const componentOffset = window.sheetContainerRef.current.offsetLeft;

  const scrollbarSize = getScrollbarSize();

  // Do not consider scroll offset when freeze
  const adjustedScrollOffset = column <= sheetFreezeColumnCount ? 0 : scrollLeft;

  const minScrollOffset = adjustedScrollOffset;
  const maxScrollOffset = adjustedScrollOffset + clientWidth - scrollbarSize;

  const possibleMaxOffset = Math.max(columnOffset, maxScrollOffset);
  const possibleMinOffset = Math.max(columnOffset, minScrollOffset);

  let adjustedOffset = xOffset + adjustedScrollOffset - componentOffset;

  if (adjustedOffset < possibleMinOffset) {
    adjustedOffset = possibleMinOffset;
  } else if (adjustedOffset > possibleMaxOffset) {
    adjustedOffset = possibleMaxOffset;
  }

  if (adjustedOffset > freezeColumnOffset && column <= sheetFreezeColumnCount) {
    adjustedOffset += scrollLeft;
  }

  newState.columnResizeData = {
    ...newState.columnResizeData,
    offset: adjustedOffset,
  };

  return newState;
};

export default RESIZE_COLUMN;
