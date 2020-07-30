import { getNormalColumnWidth, getExcelColumnWidth } from '../../../../../tools/excel';
import { DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER } from '../../../../../constants/excel';

const RESIZE_COLUMN_END = (state, { leftOffsets }) => {
  const newState = { ...state };
  const {
    columnResizeData,
    sheetFreezeColumnCount,
    sheetColumnWidths,

    scrollData,
  } = newState;

  const { column, offset } = columnResizeData;
  const { scrollLeft } = scrollData;

  const sheetFreezeColumnEndOffset =
    leftOffsets[sheetFreezeColumnCount] +
    (sheetFreezeColumnCount
      ? getNormalColumnWidth(sheetColumnWidths[sheetFreezeColumnCount])
      : DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER);

  const columnLeftOffset = leftOffsets[column];
  const columnWidth = getNormalColumnWidth(sheetColumnWidths[column]);
  const currentOffset = columnLeftOffset + columnWidth;

  let newColumnWidth = offset - columnLeftOffset;

  if (column <= sheetFreezeColumnCount && offset > sheetFreezeColumnEndOffset)
    newColumnWidth -= scrollLeft;

  if (offset !== currentOffset) {
    newState.columnWidths = {
      ...sheetColumnWidths,
      [column]: getExcelColumnWidth(newColumnWidth),
    };
    window.sheetGridRef.current.resetAfterColumnIndex(column);
  }

  newState.isColumnResizeMode = false;
  newState.columnResizeData = null;

  return newState;
};

export default RESIZE_COLUMN_END;
