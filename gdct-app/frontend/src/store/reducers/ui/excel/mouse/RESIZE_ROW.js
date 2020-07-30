import { getScrollbarSize, getNormalRowHeight } from '../../../../../tools/excel';

import { DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER } from '../../../../../constants/excel';

const RESIZE_ROW = (state, { yOffset, topOffsets }) => {
  const newState = { ...state };

  const {
    scrollData: { scrollTop },
    sheetRowHeights,
    sheetFreezeRowCount,
    rowResizeData,
  } = newState;

  const { row } = rowResizeData;
  const rowOffset = topOffsets[row];
  const { clientHeight } = window.sheetContainerRef.current;
  const freezeRowOffset =
    topOffsets[sheetFreezeRowCount] +
    (sheetFreezeRowCount
      ? getNormalRowHeight(sheetRowHeights[sheetFreezeRowCount])
      : DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER);

  const componentOffset = window.sheetContainerRef.current.offsetTop;

  const scrollbarSize = getScrollbarSize();

  // ! Do not consider scroll offset when freeze .. not sure what I did here!!!
  const adjustedScrollOffset = row <= sheetFreezeRowCount ? 0 : scrollTop;

  const minScrollOffset = adjustedScrollOffset;
  const maxScrollOffset = adjustedScrollOffset + clientHeight - scrollbarSize;

  const possibleMaxOffset = Math.max(rowOffset, maxScrollOffset);
  const possibleMinOffset = Math.max(rowOffset, minScrollOffset);

  let adjustedOffset = yOffset + adjustedScrollOffset - componentOffset;

  if (adjustedOffset < possibleMinOffset) {
    adjustedOffset = possibleMinOffset;
  } else if (adjustedOffset > possibleMaxOffset) {
    adjustedOffset = possibleMaxOffset;
  }

  if (adjustedOffset > freezeRowOffset && row <= sheetFreezeRowCount) adjustedOffset += scrollTop;

  newState.rowResizeData = { ...newState.rowResizeData, offset: adjustedOffset };

  return newState;
};

export default RESIZE_ROW;
