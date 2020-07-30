import React, { Fragment } from 'react';

import { connect } from 'react-redux';

import { getNormalColumnWidth, getNormalRowHeight } from '../../../../../tools/excel';

import {
  DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER,
  DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER,
} from '../../../../../constants/excel';

import topOffsetsSelector from '../../../../../store/selectors/ui/excel/topOffsets';
import leftOffsetsSelector from '../../../../../store/selectors/ui/excel/leftOffsets';

import './HeaderSelection.scss';

const mergeSegments = segments => {
  if (!segments.length) return [];

  segments.sort((segment1, segment2) => segment1[0] - segment2[0]);

  const merged = [segments[0]];
  let lastIndex = 0;

  const segmentsCount = segments.length;

  for (let segmentIndex = 1; segmentIndex < segmentsCount; segmentIndex++) {
    const segment = segments[segmentIndex];
    const currentSegmentStart = segment[0];
    const previousSegmentEnd = merged[lastIndex][1];

    // Possible overlap case
    if (currentSegmentStart <= previousSegmentEnd) {
      const currentSegmentEnd = segment[1];

      // Extend previous segment
      if (currentSegmentEnd > previousSegmentEnd) merged[lastIndex][1] = currentSegmentEnd;
    } else {
      merged.push(segment);
      lastIndex++;
    }
  }

  return merged;
};

const mapHeaderStateToProps = ({
  ui: {
    excel: {
      present: {
        activeCellPosition,
        activeSelectionArea,
        stagnantSelectionAreas,
        sheetCellData,
        sheetColumnWidths,
        sheetRowHeights,
        sheetRowCount,
        sheetColumnCount,
        sheetFreezeColumnCount,
        sheetFreezeRowCount,
      },
    },
  },
}) => ({
  activeCellPosition,
  activeSelectionArea,
  stagnantSelectionAreas,
  sheetCellData,
  sheetColumnWidths,
  sheetRowHeights,
  sheetRowCount,
  sheetColumnCount,
  sheetFreezeColumnCount,
  sheetFreezeRowCount,
  topOffsets: topOffsetsSelector({ sheetRowCount, sheetRowHeights }),
  leftOffsets: leftOffsetsSelector({ sheetColumnCount, sheetColumnWidths }),
});

const HeaderSelectionComponents = ({ headerStyles }) =>
  headerStyles.map((headerStyle, index) => (
    <div key={`header-selection-${index}`} className="headerStyles" style={headerStyle} />
  ));

export let HeaderSelection = ({
  activeCellPosition,
  activeSelectionArea,
  stagnantSelectionAreas,
  sheetCellData,
  sheetColumnWidths,
  sheetRowHeights,
  sheetFreezeColumnCount,
  sheetFreezeRowCount,
  topOffsets,
  leftOffsets,
}) => {
  const { x, y } = activeCellPosition;

  let activeCellPositionArea;

  // Format active cell position
  if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
    activeCellPositionArea = sheetCellData[y][x].merged;
  } else {
    activeCellPositionArea = { x1: x, y1: y, x2: x, y2: y };
  }

  const combinedAreas = [activeCellPositionArea, ...stagnantSelectionAreas];

  if (activeSelectionArea) combinedAreas.push(activeSelectionArea);

  const xSegments = [];
  const ySegments = [];

  // Sort points in each segment
  combinedAreas.forEach(({ x1, y1, x2, y2 }) => {
    const ySegment = [Math.min(y1, y2), Math.max(y1, y2)];
    const xSegment = [Math.min(x1, x2), Math.max(x1, x2)];

    if (ySegment[0] <= sheetFreezeRowCount) {
      if (ySegment[1] > sheetFreezeRowCount) ySegment[1] = sheetFreezeRowCount;
      ySegments.push(ySegment);
    }

    if (xSegment[0] <= sheetFreezeColumnCount) {
      if (xSegment[1] > sheetFreezeColumnCount) xSegment[1] = sheetFreezeColumnCount;
      xSegments.push(xSegment);
    }
  });

  const yElementarySegments = mergeSegments(ySegments);
  const xElementarySegments = mergeSegments(xSegments);

  if (!yElementarySegments.length && !xElementarySegments.length) return null;

  const rowHeaderStyles = yElementarySegments.map(([start, end]) => {
    const topStart = topOffsets[start];
    const width = DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER;

    const topEnd = topOffsets[end];

    const heightEnd = getNormalRowHeight(sheetRowHeights[end]);

    return {
      top: topStart,
      left: 0,
      height: topEnd + heightEnd - topStart,
      width,
    };
  });

  const columnHeaderStyles = xElementarySegments.map(([start, end]) => {
    const leftStart = leftOffsets[start];
    const height = DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER;

    const leftEnd = leftOffsets[end];

    const widthEnd = getNormalColumnWidth(sheetColumnWidths[end]);

    return {
      top: 0,
      left: leftStart,
      height,
      width: leftEnd + widthEnd - leftStart,
    };
  });

  return (
    <Fragment>
      <HeaderSelectionComponents headerStyles={rowHeaderStyles} />
      <HeaderSelectionComponents headerStyles={columnHeaderStyles} />
    </Fragment>
  );
};

HeaderSelection = connect(mapHeaderStateToProps)(HeaderSelection);

const mapColumnHeaderStateToProps = ({
  ui: {
    excel: {
      present: {
        activeCellPosition,
        activeSelectionArea,
        stagnantSelectionAreas,
        sheetCellData,
        sheetColumnWidths,
        sheetColumnCount,
        sheetFreezeColumnCount,
      },
    },
  },
}) => ({
  activeCellPosition,
  activeSelectionArea,
  stagnantSelectionAreas,
  sheetCellData,
  sheetColumnWidths,
  sheetColumnCount,
  sheetFreezeColumnCount,
  leftOffsets: leftOffsetsSelector({ sheetColumnCount, sheetColumnWidths }),
});

export let ColumnHeaderSelection = ({
  activeCellPosition,
  activeSelectionArea,
  stagnantSelectionAreas,
  sheetCellData,
  sheetColumnWidths,
  sheetFreezeColumnCount,
  leftOffsets,
}) => {
  const { y, x } = activeCellPosition;

  let activeCellPositionArea;

  // Format active cell position
  if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
    const {
      merged: { x1, x2 },
    } = sheetCellData[y][x];
    activeCellPositionArea = { x1, x2 };
  } else {
    activeCellPositionArea = { x1: x, x2: x };
  }

  const combinedAreas = [activeCellPositionArea, ...stagnantSelectionAreas];

  if (activeSelectionArea) combinedAreas.push(activeSelectionArea);

  const xSegments = [];

  // Sort points in each segment
  combinedAreas.forEach(({ x1, x2 }) => {
    const xSegment = [Math.min(x1, x2), Math.max(x1, x2)];

    if (xSegment[1] > sheetFreezeColumnCount) {
      if (xSegment[0] <= sheetFreezeColumnCount) xSegment[0] = sheetFreezeColumnCount + 1;
      xSegments.push(xSegment);
    }
  });

  const xElementarySegments = mergeSegments(xSegments);

  if (!xElementarySegments.length) return null;

  const columnHeaderStyles = xElementarySegments.map(([start, end]) => {
    const leftStart = leftOffsets[start];
    const height = DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER;

    const leftEnd = leftOffsets[end];
    const widthEnd = getNormalColumnWidth(sheetColumnWidths[end]);

    return {
      top: 0,
      left: leftStart,
      height,
      width: leftEnd + widthEnd - leftStart,
    };
  });

  return <HeaderSelectionComponents headerStyles={columnHeaderStyles} />;
};

ColumnHeaderSelection = connect(mapColumnHeaderStateToProps)(ColumnHeaderSelection);

const mapRowHeaderStateToProps = ({
  ui: {
    excel: {
      present: {
        activeCellPosition,
        activeSelectionArea,
        stagnantSelectionAreas,
        sheetCellData,
        sheetRowHeights,
        sheetRowCount,
        sheetFreezeRowCount,
      },
    },
  },
}) => ({
  activeCellPosition,
  activeSelectionArea,
  stagnantSelectionAreas,
  sheetCellData,
  sheetRowHeights,
  sheetRowCount,
  sheetFreezeRowCount,

  topOffsets: topOffsetsSelector({ sheetRowCount, sheetRowHeights }),
});

export let RowHeaderSelection = ({
  activeCellPosition,
  activeSelectionArea,
  stagnantSelectionAreas,
  sheetCellData,
  sheetRowHeights,
  sheetFreezeRowCount,
  topOffsets,
}) => {
  const { y, x } = activeCellPosition;

  let activeCellPositionArea;

  // Format active cell position
  if (sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].merged) {
    const {
      merged: { y1, y2 },
    } = sheetCellData[y][x];
    activeCellPositionArea = { y1, y2 };
  } else {
    activeCellPositionArea = { y1: y, y2: y };
  }

  const combinedAreas = [activeCellPositionArea, ...stagnantSelectionAreas];

  if (activeSelectionArea) combinedAreas.push(activeSelectionArea);

  const ySegments = [];

  // Sort points in each segment
  combinedAreas.forEach(({ y1, y2 }) => {
    const ySegment = [Math.min(y1, y2), Math.max(y1, y2)];

    if (ySegment[1] > sheetFreezeRowCount) {
      if (ySegment[0] <= sheetFreezeRowCount) ySegment[0] = sheetFreezeRowCount + 1;
      ySegments.push(ySegment);
    }
  });

  const yElementarySegments = mergeSegments(ySegments);

  if (!yElementarySegments.length) return null;

  const rowHeaderStyles = yElementarySegments.map(([start, end]) => {
    const topStart = topOffsets[start];
    const width = DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER;

    const topEnd = topOffsets[end];
    const heightEnd = getNormalRowHeight(sheetRowHeights[end]);

    const topFreeze = topOffsets[sheetFreezeRowCount];
    const heightFreeze = getNormalRowHeight(sheetRowHeights[sheetFreezeRowCount]);

    return {
      top: topStart - topFreeze - heightFreeze,
      left: 0,
      height: topEnd + heightEnd - topStart,
      width,
    };
  });

  return <HeaderSelectionComponents headerStyles={rowHeaderStyles} />;
};

RowHeaderSelection = connect(mapRowHeaderStateToProps)(RowHeaderSelection);
