const SELECT_END = (state, { ctrlKey }) => {
  const newState = { ...state };

  const { activeSelectionArea, stagnantSelectionAreas } = newState;

  newState.isSelectionMode = false;

  if (activeSelectionArea) {
    const { x1, y1, x2, y2 } = activeSelectionArea;

    if (x1 !== x2 || y1 !== y2 || ctrlKey) {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);

      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);

      // Cut the first superset stagnant selection area
      const supersetIndex = stagnantSelectionAreas.findIndex(
        ({ x1: sX1, x2: sX2, y1: sY1, y2: sY2 }) => {
          const minSX = Math.min(sX1, sX2);
          const maxSX = Math.max(sX1, sX2);

          const minSY = Math.min(sY1, sY2);
          const maxSY = Math.max(sY1, sY2);

          const isXContained = minSX <= minX && maxX <= maxSX;
          const isYContained = minSY <= minY && maxY <= maxSY;

          return isXContained && isYContained;
        },
      );

      if (supersetIndex >= 0) {
        const { x1: sX1, x2: sX2, y1: sY1, y2: sY2 } = stagnantSelectionAreas[supersetIndex];
        const minSX = Math.min(sX1, sX2);
        const midLeftSX = minX;
        const midRightSX = maxX;
        const maxSX = Math.max(sX1, sX2);

        const minSY = Math.min(sY1, sY2);
        const midTopSY = minY;
        const midBottomSY = maxY;
        const maxSY = Math.max(sY1, sY2);

        const newAreas = [];

        if (minSY !== midTopSY)
          newAreas.push({ x1: minSX, x2: maxSX, y1: minSY, y2: midTopSY - 1 });
        if (minSX !== midLeftSX)
          newAreas.push({
            x1: minSX,
            x2: midLeftSX - 1,
            y1: midTopSY,
            y2: midBottomSY,
          });
        if (maxSX !== midRightSX)
          newAreas.push({
            x1: midRightSX + 1,
            x2: maxSX,
            y1: midTopSY,
            y2: midBottomSY,
          });
        if (maxSY !== midBottomSY)
          newAreas.push({
            x1: minSX,
            x2: maxSX,
            y1: midBottomSY + 1,
            y2: maxSY,
          });

        newState.stagnantSelectionAreas = [
          ...stagnantSelectionAreas.slice(0, supersetIndex),
          ...newAreas,
          ...stagnantSelectionAreas.slice(supersetIndex + 1),
        ];

        const isNewAreasPresent = newAreas.length;
        const isNewStagnantAreasPresent = newState.stagnantSelectionAreas.length;

        if (isNewAreasPresent || isNewStagnantAreasPresent) {
          let focusedArea;
          let activeCellSelectionareaIndex;

          if (isNewAreasPresent) {
            activeCellSelectionareaIndex = supersetIndex;
            focusedArea = newAreas;
          } else {
            activeCellSelectionareaIndex = 0;
            focusedArea = newState.stagnantSelectionAreas;
          }

          const { x1, x2, y1, y2 } = focusedArea[0];

          const newX = Math.min(x1, x2);
          const newY = Math.min(y1, y2);

          newState.activeCellPosition = { x: newX, y: newY };
          newState.activeCellSelectionareaIndex = activeCellSelectionareaIndex;
        }
      } else {
        newState.stagnantSelectionAreas = [...stagnantSelectionAreas, activeSelectionArea];
        newState.activeCellSelectionareaIndex = newState.stagnantSelectionAreas.length - 1;
      }
    } else {
      newState.activeCellSelectionareaIndex = -1;
    }

    newState.activeSelectionArea = null;
  } else if (!ctrlKey) {
    newState.activeCellSelectionareaIndex = -1;
  }

  return newState;
};

export default SELECT_END;
