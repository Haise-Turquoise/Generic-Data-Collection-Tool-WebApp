import React, { Fragment } from 'react';

import CommonActivityPane from './CommonActivityPane';

import { ColumnHeaderSelection } from './HeaderSelection';

import { getNormalRowHeight, getNormalColumnWidth } from '../../../../tools/excel';

import { ColumnHeaderIndicator } from './HeaderResize';

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
    borderRightWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderRightColor: STYLE_SELECTION_BORDER_COLOR,
    borderRightStyle: borderStyle,
    borderTopWidth: STYLE_SELECTION_BORDER_WIDTH,
    borderTopColor: STYLE_SELECTION_BORDER_COLOR,
    borderTopStyle: borderStyle,
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

  if (freezeColumnCount && (x1 <= freezeColumnCount || x2 <= freezeColumnCount)) {
    left = leftFrozenEnd + widthFrozenEnd;

    if (x1 < x2) {
      selectionAreaWidth = leftEnd + widthEnd - left;
    } else {
      selectionAreaWidth = leftStart + widthStart - left;
    }
  } else {
    if (x1 < x2) {
      selectionAreaWidth = leftEnd + widthEnd - leftStart;
      left = leftStart;
    } else {
      selectionAreaWidth = leftStart + widthStart - leftEnd;
      left = leftEnd;
    }

    customSelectionStyle.borderLeftWidth = STYLE_SELECTION_BORDER_WIDTH;
    customSelectionStyle.borderLeftColor = STYLE_SELECTION_BORDER_COLOR;
    customSelectionStyle.borderLeftStyle = borderStyle;
  }

  const minTop = y1 < y2 ? topStart : topEnd;
  top = minTop;

  if (y1 > freezeRowCount || y2 > freezeRowCount) {
    selectionAreaHeight = topFrozenEnd + heightFrozenEnd - top;
  } else {
    if (y1 < y2) {
      selectionAreaHeight = topEnd + heightEnd - topStart;
    } else {
      selectionAreaHeight = topStart + heightStart - topEnd;
    }

    customSelectionStyle.borderBottomWidth = STYLE_SELECTION_BORDER_WIDTH;
    customSelectionStyle.borderBottomColor = STYLE_SELECTION_BORDER_COLOR;
    customSelectionStyle.borderBottomStyle = borderStyle;
  }

  customSelectionStyle.left = left;
  customSelectionStyle.top = top;
  customSelectionStyle.width = selectionAreaWidth;
  customSelectionStyle.height = selectionAreaHeight;
  customSelectionStyle.display = null;

  return customSelectionStyle;
};

const TopRightActivityPane = () => {
  const isActiveCellInCorrectPane = (x, y, sheetFreezeColumnCount, sheetFreezeRowCount) =>
    x > sheetFreezeColumnCount && y <= sheetFreezeRowCount;
  const isRelevantArea = (x1, y1, x2, y2, sheetFreezeColumnCount, sheetFreezeRowCount) =>
    (x1 > sheetFreezeColumnCount || x2 > sheetFreezeColumnCount) &&
    (y1 <= sheetFreezeRowCount || y2 <= sheetFreezeRowCount);
  const isRelevantRowOffset = (rowOffset, freezeRowOffset) => rowOffset <= freezeRowOffset;
  const isRelevantColumnOffset = (columnOffset, freezeColumnOffset) =>
    columnOffset > freezeColumnOffset;

  return (
    <Fragment>
      <CommonActivityPane
        isActiveCellInCorrectPane={isActiveCellInCorrectPane}
        isRelevantArea={isRelevantArea}
        computeSelectionAreaStyle={computeSelectionAreaStyle}
      />
      <ColumnHeaderSelection />
      <ColumnHeaderIndicator isRelevantColumnOffset={isRelevantColumnOffset} />
    </Fragment>
  );
};

export default TopRightActivityPane;
