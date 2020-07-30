import React, { Fragment } from 'react';

import CommonActivityPane from './CommonActivityPane';

import { RowHeaderSelection } from './HeaderSelection';

import { getNormalRowHeight, getNormalColumnWidth } from '../../../../tools/excel';

import { RowHeaderIndicator } from './HeaderResize';

import {
  STYLE_SELECTION_BORDER_COLOR,
  STYLE_SELECTION_BORDER_WIDTH,
  STYLE_ACTIVE_SELECTION_BORDER_STYLE,
  STYLE_STAGNANT_SELECTION_BORDER_STYLE,
} from '../../../../constants/styles';

const computeSelectionAreaStyle = (
  columnWidths,
  leftOffsets,
  rowHeights,
  topOffsets,
  selectionArea,
  freezeColumnCount,
  freezeRowCount,
  isActive,
) => {
  const { x1, y1, x2, y2 } = selectionArea;

  const borderStyle = isActive
    ? STYLE_ACTIVE_SELECTION_BORDER_STYLE
    : STYLE_STAGNANT_SELECTION_BORDER_STYLE;
  let selectionAreaWidth;
  let selectionAreaHeight;
  let left;
  let top;

  const customSelectionStyle = {
    borderLeftWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderLeftColor: STYLE_SELECTION_BORDER_COLOR,
    borderLeftStyle: borderStyle,
    borderBottomWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderBottomColor: STYLE_SELECTION_BORDER_COLOR,
    borderBottomStyle: borderStyle,
  };

  const topStart = topOffsets[y1];
  const leftStart = leftOffsets[x1];
  const widthStart = getNormalColumnWidth(columnWidths[x1]);
  const heightStart = getNormalRowHeight(rowHeights[y1]);

  const topEnd = topOffsets[y2];
  const leftEnd = leftOffsets[x2];
  const widthEnd = getNormalColumnWidth(columnWidths[x2]);
  const heightEnd = getNormalRowHeight(rowHeights[y2]);

  const topFrozenEnd = topOffsets[freezeRowCount];
  const leftFrozenEnd = leftOffsets[freezeColumnCount];
  const widthFrozenEnd = getNormalColumnWidth(columnWidths[freezeColumnCount]);
  const heightFrozenEnd = getNormalRowHeight(rowHeights[freezeRowCount]);

  const minLeft = x1 < x2 ? leftStart : leftEnd;
  left = minLeft;

  if (x1 > freezeColumnCount || x2 > freezeColumnCount) {
    selectionAreaWidth = leftFrozenEnd + widthFrozenEnd - minLeft;
  } else {
    if (x1 < x2) {
      selectionAreaWidth = leftEnd + widthEnd - minLeft;
    } else {
      selectionAreaWidth = leftStart + widthStart - minLeft;
    }

    customSelectionStyle.borderRightWidth = STYLE_SELECTION_BORDER_WIDTH;
    customSelectionStyle.borderRightColor = STYLE_SELECTION_BORDER_COLOR;
    customSelectionStyle.borderRightColor = STYLE_SELECTION_BORDER_COLOR;
    customSelectionStyle.borderRightStyle = borderStyle;
  }

  if (freezeRowCount && (y1 <= freezeRowCount || y2 <= freezeRowCount)) {
    top = 0;

    if (y1 < y2) {
      selectionAreaHeight = topEnd + heightEnd - topFrozenEnd - heightFrozenEnd;
    } else {
      selectionAreaHeight = topStart + heightStart - topFrozenEnd - heightFrozenEnd;
    }
  } else {
    if (y1 < y2) {
      top = topStart - topFrozenEnd - heightFrozenEnd;
      selectionAreaHeight = topEnd + heightEnd - topStart;
    } else {
      top = topEnd - topFrozenEnd - heightFrozenEnd;
      selectionAreaHeight = topStart + heightStart - topEnd;
    }

    customSelectionStyle.borderTopWidth = STYLE_SELECTION_BORDER_WIDTH;
    customSelectionStyle.borderTopColor = STYLE_SELECTION_BORDER_COLOR;
    customSelectionStyle.borderTopStyle = borderStyle;
  }

  customSelectionStyle.left = left;
  customSelectionStyle.top = top;
  customSelectionStyle.width = selectionAreaWidth;
  customSelectionStyle.height = selectionAreaHeight;
  customSelectionStyle.display = null;

  return customSelectionStyle;
};

const computeActiveCellStyle = (
  x,
  y,
  columnWidths,
  leftOffsets,
  rowHeights,
  topOffsets,
  _sheetFreezeColumnCount,
  sheetFreezeRowCount,
  sheetCellData,
) => {
  let height;
  let width;
  let left;
  let top;

  const mergeData = sheetCellData[y] && sheetCellData[y][x] ? sheetCellData[y][x].merged : null;

  if (mergeData) {
    const { x1, x2, y1, y2 } = mergeData;

    height = topOffsets[y2] + getNormalRowHeight(rowHeights[y2]) - topOffsets[y1];
    width = leftOffsets[x2] + getNormalColumnWidth(columnWidths[x2]) - leftOffsets[x1];
    top = topOffsets[y1];
    left = leftOffsets[x1];
  } else {
    height = getNormalRowHeight(rowHeights[y]);
    width = getNormalColumnWidth(columnWidths[x]);
    top = topOffsets[y];
    left = leftOffsets[x];
  }

  const activeCellStyle = {
    top,
    left,
    height,
    width,
  };

  const topFreeze = topOffsets[sheetFreezeRowCount];
  const heightFreeze = getNormalRowHeight(rowHeights[sheetFreezeRowCount]);

  activeCellStyle.top = activeCellStyle.top - topFreeze - heightFreeze;

  return activeCellStyle;
};

const BottomLeftActivityPane = () => {
  const computeTopOffset = (offset, freezeEndOffset) => offset - freezeEndOffset;
  const isActiveCellInCorrectPane = (x, y, sheetFreezeColumnCount, sheetFreezeRowCount) =>
    x <= sheetFreezeColumnCount && y > sheetFreezeRowCount;
  const isRelevantArea = (x1, y1, x2, y2, sheetFreezeColumnCount, sheetFreezeRowCount) =>
    (x1 <= sheetFreezeColumnCount || x2 <= sheetFreezeColumnCount) &&
    (y1 > sheetFreezeRowCount || y2 > sheetFreezeRowCount);
  const isRelevantRowOffset = (rowOffset, freezeRowOffset) => rowOffset > freezeRowOffset;
  const isRelevantColumnOffset = (columnOffset, freezeColumnOffset) =>
    columnOffset <= freezeColumnOffset;

  return (
    <Fragment>
      <CommonActivityPane
        isActiveCellInCorrectPane={isActiveCellInCorrectPane}
        isRelevantArea={isRelevantArea}
        computeActiveCellStyle={computeActiveCellStyle}
        computeSelectionAreaStyle={computeSelectionAreaStyle}
      />
      <RowHeaderSelection />
      <RowHeaderIndicator
        computeTopOffset={computeTopOffset}
        isRelevantRowOffset={isRelevantRowOffset}
      />
    </Fragment>
  );
};

export default BottomLeftActivityPane;
