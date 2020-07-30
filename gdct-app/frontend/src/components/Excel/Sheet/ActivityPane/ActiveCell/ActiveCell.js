import React, { useEffect, useCallback } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import Popover, { ArrowContainer } from 'react-tiny-popover';
import {
  getNormalRowHeight,
  getNormalColumnWidth,
  isPrepopulateString,
  parsePrepopulateString,
  getAreaDimensions,
  getBlockStyle,
} from '../../../../../tools/excel';

import { resetActiveCellDialog } from '../../../../../store/actions/ui/excel/commands';

import CellEditor from './CellEditor';

import topOffsetsSelector from '../../../../../store/selectors/ui/excel/topOffsets';
import leftOffsetsSelector from '../../../../../store/selectors/ui/excel/leftOffsets';

import BusinessConceptPopup from './BusinessConceptPopup';
import PrepopulatePopup from './PrepopulatePopup';
import CommentPopup from './CommentPopup';
import COAPopup from './COAPopup';

import './ActiveCell.scss';

const ActiveCellDialog = ({
  activeCellDialog,
  position,
  targetRect,
  popoverRect,
  comments,
  value,
}) => {
  const handleKeyDownCapture = event => {
    const { key, ctrlKey } = event;

    // if(
    //   key === "ArrowUp"
    //   || key === "ArrowDown"
    //   || key === "ArrowRight"
    //   || key === "ArrowLeft"
    // ) {
    event.stopPropagation();
    // }
  };

  const handleContextMenuCapture = event => event.stopPropagation();

  let Children;

  if (activeCellDialog) {
    const { dialog, category } = activeCellDialog;
    if (dialog === 'comment') {
      Children = <CommentPopup comments={comments} />;
    } else if (dialog === 'concept') {
      Children = <BusinessConceptPopup type={category} />;
    } else if (dialog === 'prepopulate') {
      let conceptParameters;

      if (typeof value === 'string' && isPrepopulateString(value)) {
        conceptParameters = parsePrepopulateString(value);
      } else {
        conceptParameters = {};
      }

      Children = <PrepopulatePopup {...conceptParameters} />;
    } else if (dialog === 'group') {
      Children = <COAPopup type={category} />;
    }
  }

  return (
    <ArrowContainer
      position={position}
      targetRect={targetRect}
      popoverRect={popoverRect}
      arrowColor="green"
      arrowSize={10}
      arrowStyle={{ opacity: 0.7 }}
    >
      <div onKeyDownCapture={handleKeyDownCapture} onContextMenuCapture={handleContextMenuCapture}>
        {Children}
      </div>
    </ArrowContainer>
  );
};

const ActiveInputCell = ({ activeCellStyle, blockStyle, isSheetFocused }) => {
  const handleReturn = event => {
    const { key, ctrlKey, altKey } = event;
    if (key === 'Escape') event.preventDefault();
    return key === 'Enter' && !ctrlKey && !altKey ? 'handled' : 'not-handled';
  };

  const handleContextMenuCapture = event => event.stopPropagation();
  const handleKeyDownCapture = event => {
    const { key, ctrlKey } = event;

    if (ctrlKey && key === 'a') event.stopPropagation();
  };

  return (
    <div
      className="activeCell activeCell--editMode"
      style={activeCellStyle}
      onContextMenuCapture={handleContextMenuCapture}
      onKeyDownCapture={handleKeyDownCapture}
    >
      <CellEditor
        key="active-cell-input"
        blockStyle={blockStyle}
        readOnly={!isSheetFocused}
        handleReturn={handleReturn}
      />
    </div>
  );
};

const ActiveNormalCell = ({ activeCellStyle, activeCellDialog, comments, value }) => {
  return activeCellDialog ? (
    <Popover
      isOpen={activeCellDialog}
      position="right"
      transitionDuration={0}
      content={props => (
        <ActiveCellDialog
          {...props}
          activeCellDialog={activeCellDialog}
          comments={comments}
          value={value}
        />
      )}
    >
      <div
        key="inactive-cell-input"
        className="activeCell activeCell--normalMode"
        style={activeCellStyle}
      />
    </Popover>
  ) : (
    <div
      key="inactive-cell-input"
      className="activeCell activeCell--normalMode"
      style={activeCellStyle}
    />
  );
};

const ActiveCell = ({ computeActiveCellStyle, isActiveCellInCorrectPane }) => {
  const {
    isEditMode,
    editorState,
    isSheetFocused,

    sheetFreezeColumnCount,
    sheetFreezeRowCount,

    sheetColumnCount,
    sheetRowCount,

    sheetColumnWidths,
    sheetRowHeights,

    sheetCellData,

    activeCellDialog,

    x,
    y,

    topOffsets,
    leftOffsets,
  } = useSelector(
    ({
      ui: {
        excel: {
          present: {
            isEditMode,
            editorState,
            isSheetFocused,

            activeCellPosition,

            sheetFreezeColumnCount,
            sheetFreezeRowCount,

            sheetColumnCount,
            sheetRowCount,

            sheetColumnWidths,
            sheetRowHeights,

            sheetCellData,

            activeCellDialog,
          },
        },
      },
    }) => ({
      isEditMode,
      editorState,
      isSheetFocused,

      ...activeCellPosition,

      sheetFreezeColumnCount,
      sheetFreezeRowCount,

      sheetColumnCount,
      sheetRowCount,

      sheetColumnWidths,
      sheetRowHeights,

      sheetCellData,

      activeCellDialog,

      topOffsets: topOffsetsSelector({ sheetRowHeights, sheetRowCount }),
      leftOffsets: leftOffsetsSelector({ sheetColumnWidths, sheetColumnCount }),
    }),
    shallowEqual,
  );

  if (!isActiveCellInCorrectPane(x, y, sheetFreezeColumnCount, sheetFreezeRowCount)) return null;

  let activeCellStyle;

  let top = topOffsets[y];
  let left = leftOffsets[x];

  if (computeActiveCellStyle) {
    activeCellStyle = computeActiveCellStyle(
      x,
      y,
      sheetColumnWidths,
      leftOffsets,
      sheetRowHeights,
      topOffsets,
      sheetFreezeColumnCount,
      sheetFreezeRowCount,
      sheetCellData,
    );
    activeCellStyle.minHeight = activeCellStyle.height;
    activeCellStyle.minWidth = activeCellStyle.width;
  } else {
    let height = getNormalRowHeight(sheetRowHeights[y]);
    let width = getNormalColumnWidth(sheetColumnWidths[x]);

    if (sheetCellData[y] && sheetCellData[y][x]) {
      const { merged } = sheetCellData[y][x];

      if (merged) {
        const { x1, y1, x2, y2 } = merged;
        const mergeDimensions = getAreaDimensions({
          x1,
          y1,
          x2,
          y2,
          topOffsets,
          leftOffsets,
          sheetColumnWidths,
          sheetRowHeights,
        });

        height = mergeDimensions.height;
        width = mergeDimensions.width;

        top = topOffsets[y1];
        left = leftOffsets[x1];
      }
    }

    activeCellStyle = {
      top,
      left,
      height,
      width,
      minHeight: height,
      minWidth: width,
    };
  }

  activeCellStyle.maxWidth =
    leftOffsets[sheetColumnCount - 1] +
    getNormalColumnWidth(sheetColumnWidths[sheetColumnCount]) -
    leftOffsets[x];
  activeCellStyle.maxHeight =
    topOffsets[sheetRowCount - 1] +
    getNormalRowHeight(sheetRowHeights[sheetRowCount]) -
    topOffsets[y];

  let displayedComments = [];
  let displayedValue = '';
  let blockStyle = {};

  if (sheetCellData[y] && sheetCellData[y][x]) {
    const { comments, styles, value } = sheetCellData[y][x];

    if (styles) blockStyle = styles;
    if (comments) displayedComments = comments;
    if (value) displayedValue = value;
  }

  return isEditMode ? (
    <ActiveInputCell
      activeCellStyle={activeCellStyle}
      blockStyle={blockStyle}
      editorState={editorState}
      isSheetFocused={isSheetFocused}
    />
  ) : (
    <ActiveNormalCell
      activeCellStyle={activeCellStyle}
      activeCellDialog={activeCellDialog}
      comments={displayedComments}
      value={displayedValue}
    />
  );
};

export default ActiveCell;
