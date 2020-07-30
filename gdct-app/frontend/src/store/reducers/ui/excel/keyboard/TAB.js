import { saveActiveCellInputData, updateActiveCellPosition } from '../tools/cell';
import { getMergedData, getShiftTabFreeSpot, getTabFreeSpot } from '../tools/merge';

const TAB = (state, { shiftKey }) => {
  let {
    isEditMode,

    activeCellPosition,
    activeSelectionArea,
    stagnantSelectionAreas,
    activeCellSelectionAreaIndex,

    sheetCellData,
    sheetRowCount,
    sheetColumnCount,
  } = state;

  let newState = { ...state };

  let { x, y } = activeCellPosition;

  if (isEditMode) newState = saveActiveCellInputData({ newState });

  window.sheetContainerRef.current.focus();

  let selectionArea;
  let isBounded;

  const stagnantSelectionAreasLength = stagnantSelectionAreas.length;

  // Get the rectangular scope that an active selection area can go in
  // TODO : clean up later
  if (activeSelectionArea || stagnantSelectionAreasLength) {
    if (activeSelectionArea) {
      // It is possible to have the active cell go over both active area and stagnant areas
      if (stagnantSelectionAreasLength) {
        // ! Make the first upper outer bound be the indicator that the active cell is in the acive selection area
        // ! When it's not out of bound, the cell is in a stagnant selection area
        if (stagnantSelectionAreasLength === activeCellSelectionAreaIndex) {
          selectionArea = activeSelectionArea;
        } else {
          selectionArea = stagnantSelectionAreas[activeCellSelectionAreaIndex];
        }
      } else {
        selectionArea = activeSelectionArea;
      }
    } else {
      selectionArea = stagnantSelectionAreas[activeCellSelectionAreaIndex];
    }

    isBounded = false;
  } else {
    isBounded = true;

    selectionArea = {
      x1: 1,
      y1: 1,
      x2: sheetColumnCount - 1,
      y2: sheetRowCount - 1,
    };
  }

  const { x1, y1, x2, y2 } = selectionArea;

  const startX = Math.min(x1, x2);
  const endX = Math.max(x1, x2);
  const startY = Math.min(y1, y2);
  const endY = Math.max(y1, y2);

  const merged = getMergedData(sheetCellData, y, x);

  if (shiftKey) {
    if (merged) {
      const { x1 } = merged;
      x = x1 - 1;
    } else {
      x--;
    }
  } else {
    const rowData = sheetCellData[y];

    if (stagnantSelectionAreas.length && rowData) {
      for (let column = x + 1; column <= endX; column++) {
        const cellData = rowData[column];

        if (cellData && cellData.merged) {
          const { x1: mergedX1, x2: mergedX2, y1: mergedY1 } = cellData.merged;

          if (mergedY1 === y && mergedX1 === column) {
            x = column - 1;
            break;
          } else {
            x = mergedX2;
          }
        } else {
          x = column - 1;
          break;
        }
      }

      x++;
    } else if (merged) {
      const { x2 } = merged;
      x = x2 + 1;
    } else {
      x++;
    }
  }

  // Check for bounds -- do not update when isbounded and tab goes out bounds
  if (x < startX || x > endX) {
    if (!isBounded) {
      if (shiftKey) {
        y--;

        // Find max of the top free spaces (regular cell or top left of merge cell)
        if (y >= startY) {
          const rowData = sheetCellData[y];

          if (rowData) {
            const { maxX, maxY } = getShiftTabFreeSpot({
              y,
              startX,
              endX,
              rowData,
            });

            x = maxX;
            y = maxY;
          } else {
            x = Math.max(x1, x2);
          }
        }
      } else {
        y++;

        if (y <= endY) {
          const rowData = sheetCellData[y];

          if (rowData) {
            const { minX, minY } = getTabFreeSpot({ y, startX, endX, rowData });

            x = minX;
            y = minY;
          } else {
            x = Math.min(x1, x2);
          }
        }
        // Find max of the bottom free spaces (regular cell or top left of merge cell)
      }

      // Check for bounds in y
      // Change selection areas
      if (y < startY || y > endY) {
        // Need to switch selection areas.
        y < startY ? activeCellSelectionAreaIndex-- : activeCellSelectionAreaIndex++;

        // Fix out of bounds result
        if (
          (activeSelectionArea &&
            activeCellSelectionAreaIndex === stagnantSelectionAreasLength + 1) ||
          (!activeSelectionArea && activeCellSelectionAreaIndex === stagnantSelectionAreasLength)
        ) {
          activeCellSelectionAreaIndex = 0;
        } else if (activeCellSelectionAreaIndex < 0) {
          activeSelectionArea
            ? (activeCellSelectionAreaIndex = stagnantSelectionAreasLength)
            : (activeCellSelectionAreaIndex = stagnantSelectionAreasLength - 1);
        }

        const newSelectionArea =
          activeCellSelectionAreaIndex === stagnantSelectionAreasLength
            ? activeSelectionArea
            : stagnantSelectionAreas[activeCellSelectionAreaIndex];

        const { x1: newX1, y1: newY1, x2: newX2, y2: newY2 } = newSelectionArea;

        if (y < startY) {
          x = Math.max(newX1, newX2);
          y = Math.max(newY1, newY2);

          const rowData = sheetCellData[y];

          if (rowData) {
            const { maxX, maxY } = getShiftTabFreeSpot({
              y,
              startX: Math.min(newX1, newX2),
              endX: Math.max(newX1, newX2),
              rowData,
            });

            y = maxY;
            x = maxX;
          }
        } else {
          y = Math.min(newY1, newY2);
          x = Math.min(newX1, newX2);
        }

        newState.activeCellSelectionAreaIndex = activeCellSelectionAreaIndex;
      }

      newState = updateActiveCellPosition({
        newState,
        newY: y,
        newX: x,
      });
    }
  } else {
    // ! This is not supposed to be here... move at the top
    const currentRowData = sheetCellData[y];

    if (stagnantSelectionAreas.length) {
      if (shiftKey) {
        // Check if there's free space at y (before x since shift)
        if (currentRowData) {
          const { maxX: currentMaxX, maxY: currentMaxY } = getShiftTabFreeSpot({
            endX: x,
            startX,
            y,
            rowData: currentRowData,
          });

          // Found a merged cell - not supposed to go here
          if (currentMaxY !== y) {
            y--;

            // ! Verify
            // ? Row data cannot be null since merge cell occupies it
            // ? The free spot will either be the top left spot of the merge cell or a free cell from the range of the merge cell
            const rowData = sheetCellData[y];

            const { maxX, maxY } = getShiftTabFreeSpot({
              endX,
              startX,
              y,
              rowData,
            });

            x = maxX;
            y = maxY;
          } else {
            x = currentMaxX;
            y = currentMaxY;
          }
        }
      }
    }

    newState = updateActiveCellPosition({
      newState,
      newY: y,
      newX: x,
    });
  }

  return newState;
};

export default TAB;
