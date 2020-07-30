import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';

import { getNormalRowHeight, getNormalColumnWidth } from '../../../../../tools/excel';

import {
  DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER,
  DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER,
} from '../../../../../constants/excel';

import topOffsetsSelector from '../../../../../store/selectors/ui/excel/topOffsets';
import leftOffsetsSelector from '../../../../../store/selectors/ui/excel/leftOffsets';

import './HeaderResize.scss';

export const RowHeaderIndicator = ({ isRelevantRowOffset, computeTopOffset }) => {
  const {
    isRowResizeMode,
    rowResizeData,
    sheetRowHeights,
    sheetFreezeRowCount,
    topOffsets,
  } = useSelector(
    ({
      ui: {
        excel: {
          present: {
            isRowResizeMode,
            rowResizeData,
            sheetRowHeights,
            sheetFreezeRowCount,
            sheetFreezeColumnCount,
            sheetRowCount,
          },
        },
      },
    }) => ({
      isRowResizeMode,
      rowResizeData,
      sheetRowHeights,
      sheetFreezeRowCount,
      sheetFreezeColumnCount,

      topOffsets: topOffsetsSelector({ sheetRowCount, sheetRowHeights }),
    }),
    shallowEqual,
  );

  if (!isRowResizeMode) return null;

  const freezeRowOffset =
    topOffsets[sheetFreezeRowCount] + getNormalRowHeight(sheetRowHeights[sheetFreezeRowCount]);
  const { offset } = rowResizeData;

  if (!isRelevantRowOffset(offset, freezeRowOffset)) return null;

  const indicatorStyle = {
    top: computeTopOffset ? computeTopOffset(offset, freezeRowOffset) : offset,
    left: 0,
    width: DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER,
    height: 4,
  };

  return <div style={indicatorStyle} className="resizeHeader resizeHeader__headerIndicator" />;
};

export const ColumnHeaderIndicator = ({ isRelevantColumnOffset }) => {
  const {
    isColumnResizeMode,
    columnResizeData,
    sheetFreezeColumnCount,
    sheetColumnWidths,

    leftOffsets,
  } = useSelector(
    ({
      ui: {
        excel: {
          present: {
            isColumnResizeMode,
            columnResizeData,
            sheetFreezeColumnCount,
            sheetColumnWidths,
            sheetColumnCount,
          },
        },
      },
    }) => ({
      isColumnResizeMode,
      columnResizeData,
      sheetFreezeColumnCount,
      sheetColumnWidths,

      leftOffsets: leftOffsetsSelector({ sheetColumnCount, sheetColumnWidths }),
    }),
    shallowEqual,
  );

  if (!isColumnResizeMode) return null;

  const freezeColumnOffset =
    leftOffsets[sheetFreezeColumnCount] +
    getNormalColumnWidth(sheetColumnWidths[sheetFreezeColumnCount]);
  const { offset } = columnResizeData;

  if (!isRelevantColumnOffset(offset, freezeColumnOffset)) return null;

  const indicatorStyle = {
    top: 0,
    left: offset,
    width: 4,
    height: DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER,
  };

  return <div style={indicatorStyle} className="resizeHeader resizeHeader__headerIndicator" />;
};

export const RowContentIndicator = () => {
  return <div></div>;
};

export const ColumnContentIndicator = () => {
  return <div></div>;
};
