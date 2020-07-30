import React, { useState, useCallback } from 'react';

import { batch, useSelector, useDispatch, shallowEqual } from 'react-redux';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import InputBase from '@material-ui/core/InputBase';

import { setSheet } from '../../../store/actions/ui/excel/commands';

import { enableEditMode, disableEditMode } from '../../../store/actions/ui/excel/events';

import { DnDReorder } from '../../../tools/misc';
import { generateNewSheetName, createBlankSheet } from '../../../tools/excel';

import './SheetNavigator.scss';

const AddButton = ({ handleClick }) => (
  <Button onClick={handleClick}>
    <AddIcon fontSize="small" />
  </Button>
);

const SheetNameEdit = ({ sheetName, setIsEditMode, handleChangeSheetName }) => {
  const dispatch = useDispatch();

  const handleBlur = () => useCallback(dispatch(setIsEditMode(false)), [dispatch]);

  const handleKeyDown = ({ key, target }) => {
    if (key === 'Enter') {
      // Save value
      const { value } = target;
      handleChangeSheetName(sheetName, value);
      target.blur();
    } else if (key === 'Escape') {
      // Don't save value
      target.blur();
    }
  };

  return (
    <InputBase
      style={{ minWidth: 'fit-content' }}
      defaultValue={sheetName}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  );
};

const SheetNameNormal = ({ isActive, sheetName, setIsEditMode }) => {
  const handleMouseDown = () => {
    if (!isActive) setIsEditMode(false);
  };
  const handleDoubleClick = () => setIsEditMode(true);

  return (
    <div onDoubleClick={handleDoubleClick} onMouseDown={handleMouseDown}>
      {sheetName}
    </div>
  );
};

const SheetNameDraggable = ({
  isEditMode,
  setIsEditMode,
  provided,
  sheetName,
  activeSheetName,
}) => {
  const dispatch = useDispatch();

  const isActive = activeSheetName === sheetName;

  const handleClick = useCallback(() => {
    if (!isActive) dispatch(setSheet({ sheetName }));
  }, [dispatch, isActive]);

  return (
    <div
      ref={provided.innerRef}
      className={`sheetNavigator__draggable ${
        isActive ? 'sheetNavigator__draggable--active' : 'sheetNavigator__draggable--inactive'
      }`}
      style={provided.draggableProps.style}
      onClick={handleClick}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      {isActive && isEditMode ? (
        <SheetNameEdit sheetName={sheetName} setIsEditMode={setIsEditMode} />
      ) : (
        <SheetNameNormal isActive={isActive} sheetName={sheetName} setIsEditMode={setIsEditMode} />
      )}
    </div>
  );
};

const SheetNamesDraggables = ({ isEditMode, setIsEditMode, sheetNames, activeSheetName }) =>
  sheetNames.map((sheetName, index) => (
    <Draggable key={`sheet-name-${sheetName}`} draggableId={sheetName} index={index}>
      {provided => (
        <SheetNameDraggable
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          provided={provided}
          sheetName={sheetName}
          activeSheetName={activeSheetName}
          index={index}
        />
      )}
    </Draggable>
  ));

const SheetNamesDroppable = ({ isEditMode, setIsEditMode, sheetNames, activeSheetName }) => (
  <Droppable droppableId="droppable" direction="horizontal">
    {provided => (
      <div
        ref={provided.innerRef}
        className="sheetNavigator__droppable"
        {...provided.droppableProps}
      >
        <SheetNamesDraggables
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          sheetNames={sheetNames}
          activeSheetName={activeSheetName}
        />
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

const SheetSelectionContext = ({
  isEditMode,
  setIsEditMode,
  activeSheetName,
  sheetNames,
  handleDragEnd,
}) => (
  <DragDropContext onDragEnd={handleDragEnd}>
    <SheetNamesDroppable
      isEditMode={isEditMode}
      setIsEditMode={setIsEditMode}
      sheetNames={sheetNames}
      activeSheetName={activeSheetName}
    />
  </DragDropContext>
);

const SheetNavigator = () => {
  const [isEditMode, setIsEditMode] = useState(false);

  const dispatch = useDispatch();

  const { sheetNames, activeSheetName } = useSelector(
    ({
      ui: {
        excel: {
          present: { sheetNames, activeSheetName },
        },
      },
    }) => ({
      sheetNames,
      activeSheetName,
    }),
    shallowEqual,
  );

  const handleAddSheet = useCallback(
    () =>
      batch(() => {
        const sheetName = generateNewSheetName(sheetNames);
        const sheetData = createBlankSheet();

        dispatch(addSheet({ sheetName, sheetData }));
        dispatch(changeSheet({ sheetName }));
      }),
    [dispatch],
  );

  const handleDragEnd = useCallback(
    result => {
      if (!result.destination) return;

      const newSheetNames = DnDReorder(sheetNames, result.source.index, result.destination.index);

      dispatch(setSheetNames(newSheetNames));
    },
    [dispatch],
  );

  const handleChangeSheetName = useCallback(
    (sheetName, newSheetName) => dispatch(setSheetName({ sheetName, newSheetName })),
    [dispatch],
  );

  return (
    <div className="sheetNavigator">
      <AddButton handleClick={handleAddSheet} />
      <SheetSelectionContext
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        sheetNames={sheetNames}
        activeSheetName={activeSheetName}
        handleDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default SheetNavigator;
