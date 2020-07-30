import React, { useCallback, useMemo } from 'react';

import { useDispatch, useSelector, shallowEqual } from 'react-redux';

import { VariableSizeGrid } from 'react-window';

import { ContextMenuTrigger } from 'react-contextmenu';

import AutoSizer from 'react-virtualized-auto-sizer';

import memoize from 'memoize-one';

import isHotkey from 'is-hotkey';

import { inputCharacterRegex } from '../../../tools/regex';

import { getNormalRowHeight, getNormalColumnWidth } from '../../../tools/excel';

import ContextMenu from './ContextMenu';

import WindowListener from './WindowListener';

import Cell from './Cell';

import TopLeftActivityPane from './ActivityPane/TopLeftActivityPane';
import TopRightActivityPane from './ActivityPane/TopRightActivityPane';
import BottomLeftActivityPane from './ActivityPane/BottomLeftActivityPane';
import BottomRightActivityPane from './ActivityPane/BottomRightActivityPane';

import {
  DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER,
  DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER,
  EXCEL_WINDOW_OVERSCAN_COLUMN_COUNT,
  EXCEL_WINDOW_OVERSCAN_ROW_COUNT,
} from '../../../constants/excel';

import { HOTKEYS } from '../../../constants/input';

import {
  setScrollData,
  enableEditMode,
  enableSheetFocus,
} from '../../../store/actions/ui/excel/events';
import {
  keyArrowDown,
  keyArrowUp,
  keyArrowLeft,
  keyArrowRight,
  keyEscape,
  keyTab,
  keyEnter,
  keyDelete,
} from '../../../store/actions/ui/excel/keyboard';

import { selectAll, save } from '../../../store/actions/ui/excel/commands';

import './Sheet.scss';

// !Change this to spread instead of object?
const createItemData = memoize(itemData => itemData);

const SheetWindow = ({ sheetGridRef }) => {
  const dispatch = useDispatch();

  const {
    sheetCellData,
    sheetFreezeRowCount,
    sheetFreezeColumnCount,
    sheetColumnCount,
    sheetRowCount,
    sheetColumnWidths,
    sheetRowHeights,
  } = useSelector(
    ({
      ui: {
        excel: {
          present: {
            sheetCellData,
            sheetFreezeRowCount,
            sheetFreezeColumnCount,
            sheetColumnCount,
            sheetRowCount,
            sheetColumnWidths,
            sheetRowHeights,
          },
        },
      },
    }) => ({
      sheetCellData,
      sheetFreezeRowCount,
      sheetFreezeColumnCount,
      sheetColumnCount,
      sheetRowCount,
      sheetColumnWidths,
      sheetRowHeights,
    }),
    shallowEqual,
  );

  const tableFreezeRowCount = useMemo(() => sheetFreezeRowCount + 1, [sheetFreezeRowCount]);
  const tableFreezeColumnCount = useMemo(() => sheetFreezeColumnCount + 1, [
    sheetFreezeColumnCount,
  ]);

  const rowHeight = useCallback(
    index =>
      index ? getNormalRowHeight(sheetRowHeights[index]) : DEFAULT_EXCEL_SHEET_ROW_HEIGHT_HEADER,
    [sheetRowHeights],
  );

  const columnWidth = useCallback(
    index =>
      index
        ? getNormalColumnWidth(sheetColumnWidths[index])
        : DEFAULT_EXCEL_SHEET_COLUMN_WIDTH_HEADER,
    [sheetColumnWidths],
  );

  const handleScroll = useCallback(scrollData => dispatch(setScrollData(scrollData)), [dispatch]);

  const itemData = createItemData({
    sheetCellData,

    sheetColumnCount,
    sheetRowCount,
  });

  return (
    <AutoSizer>
      {({ height, width }) => (
        <ContextMenuTrigger id="sheetWindowContainer" holdToDisplay={-1}>
          <VariableSizeGrid
            ref={sheetGridRef}
            freezeColumnCount={tableFreezeColumnCount}
            freezeRowCount={tableFreezeRowCount}
            columnCount={sheetColumnCount}
            rowCount={sheetRowCount}
            columnWidth={columnWidth}
            rowHeight={rowHeight}
            height={height}
            itemData={itemData}
            width={width}
            overscanColumnCount={EXCEL_WINDOW_OVERSCAN_COLUMN_COUNT}
            overscanRowCount={EXCEL_WINDOW_OVERSCAN_ROW_COUNT}
            onScroll={handleScroll}
            extraTopLeftElement={<TopLeftActivityPane key="top-left-selection-pane" />}
            extraTopRightElement={<TopRightActivityPane key="top-right-activity-pane" />}
            extraBottomLeftElement={<BottomLeftActivityPane key="bottom-left-activity-pane" />}
            extraBottomRightElement={<BottomRightActivityPane key="bottom-right-activity-pane" />}
          >
            {Cell}
          </VariableSizeGrid>
        </ContextMenuTrigger>
      )}
    </AutoSizer>
  );
};

const Sheet = ({ sheetGridRef, handleSave }) => {
  const dispatch = useDispatch();

  const {
    cursorType,
    isEditMode,
    sheetCellData,
    sheetFreezeRowCount,
    sheetFreezeColumnCount,
    sheetColumnCount,
    sheetRowCount,
    sheetColumnWidths,
    sheetRowHeights,
  } = useSelector(
    ({
      ui: {
        excel: {
          present: {
            cursorType,
            isEditMode,
            sheetCellData,
            sheetFreezeRowCount,
            sheetFreezeColumnCount,
            sheetColumnCount,
            sheetRowCount,
            sheetColumnWidths,
            sheetRowHeights,
          },
        },
      },
    }) => ({
      cursorType,
      isEditMode,
      sheetCellData,
      sheetFreezeRowCount,
      sheetFreezeColumnCount,
      sheetColumnCount,
      sheetRowCount,
      sheetColumnWidths,
      sheetRowHeights,
    }),
    shallowEqual,
  );

  const handleKeyDown = useCallback(
    event => {
      const { key, shiftKey, ctrlKey, altKey, metaKey } = event;

      let action;

      if (key === 'ArrowUp') {
        action = keyArrowUp({ shiftKey });
      } else if (key === 'ArrowDown') {
        action = keyArrowDown({ shiftKey });
      } else if (key === 'ArrowLeft') {
        action = keyArrowLeft({ shiftKey });
      } else if (key === 'ArrowRight') {
        action = keyArrowRight({ shiftKey });
      } else if (key === 'Tab') {
        event.preventDefault();
        action = keyTab({ shiftKey });
      } else if (key === 'Enter' && !(ctrlKey || metaKey) && !altKey) {
        action = keyEnter({ shiftKey });
      } else if (key === 'Delete' || key === 'Backspace') {
        action = keyDelete();
      } else if (key === 'Escape') {
        action = keyEscape({});
      } else if (key === 's' && (ctrlKey || metaKey)) {
        // ! save
        handleSave();
        // action = save(handleSave);
      } else if (key === 'a' && (ctrlKey || metaKey)) {
        event.preventDefault();
        action = selectAll();
        // } else if (ctrlKey || metaKey) {
      } else if (inputCharacterRegex.test(key)) {
        action = enableEditMode();
      }

      // for(let hotkey in HOTKEYS) {
      //   if(isHotkey(hotkey, event)) {
      //     action = applyTextStyle(HOTKEYS[hotkey]);
      //     break;
      //   }
      // }

      if (action) dispatch(action);
    },
    [dispatch],
  );

  const handleKeyDownCapture = event => {
    const { key, shiftKey, ctrlKey, metaKey, altKey } = event;

    if (key === 's' && (ctrlKey || metaKey)) {
      event.preventDefault();
    }
  };

  // https://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
  const handleDragStart = event => {
    const selection = window.getSelection ? window.getSelection() : document.selection;

    if (selection) {
      if (selection.removeAllRanges) {
        selection.removeAllRanges();
      } else if (selection.empty) {
        selection.empty();
      }

      event.preventDefault();
    }
  };

  // TODO
  const handlePaste = ({ clipboardData }) => {
    const paste = (clipboardData || window.clipboardData).getData('text/html');

    // console.log(paste);
  };

  const handleClick = useCallback(() => {
    dispatch(enableSheetFocus());
  }, [dispatch]);

  const style = {};

  if (cursorType !== 'default') style.cursor = cursorType;

  return (
    <div
      ref={sheetContainerRef}
      className="sheet"
      style={style}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      onKeyDownCapture={handleKeyDownCapture}
      onDragStart={handleDragStart}
      onClick={handleClick}
      onPaste={handlePaste}
    >
      <SheetWindow
        sheetGridRef={sheetGridRef}
        isEditMode={isEditMode}
        sheetCellData={sheetCellData}
        sheetFreezeRowCount={sheetFreezeRowCount}
        sheetFreezeColumnCount={sheetFreezeColumnCount}
        sheetColumnCount={sheetColumnCount}
        sheetRowCount={sheetRowCount}
        sheetColumnWidths={sheetColumnWidths}
        sheetRowHeights={sheetRowHeights}
      />
      <ContextMenu />
      <WindowListener />
    </div>
  );
};

export default Sheet;
