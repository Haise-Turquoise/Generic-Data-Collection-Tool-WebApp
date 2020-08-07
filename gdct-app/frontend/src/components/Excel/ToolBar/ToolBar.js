import React, { useCallback } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import FormatStrikeThroguhIcon from '@material-ui/icons/StrikethroughS';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';
import MergeTypeIcon from '@material-ui/icons/MergeType';
import PublishIcon from '@material-ui/icons/Publish';

import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';

import { getMainFontStylesStates } from '../../../tools/styles';
import { getMainFontStyleEditorStates } from '../../../tools/slate';

import { mergeCells, unmergeCells, setExcelData } from '../../../store/actions/ui/excel/commands';

import './ToolBar.scss';
import { convertExcelFileToState, convertStateToReactState } from '../../../tools/excel';

const ToolBarButton = ({ id, children, state, disabled, className, handleClick }) => (
  <Button
    id={id}
    className={`toolBar__button ${state ? 'toolBar__button--active' : ''} ${className}`}
    disableRipple={true}
    disableFocusRipple={true}
    onClick={handleClick}
    disabled={disabled}
  >
    {children}
  </Button>
);

const LeftAlignButton = ({ handleClick }) => (
  <ToolBarButton id="align-left" handleClick={handleClick}>
    <FormatAlignLeftIcon />
  </ToolBarButton>
);

const CenterAlignButton = ({ handleClick }) => (
  <ToolBarButton id="align-center" handleClick={handleClick}>
    <FormatAlignCenterIcon />
  </ToolBarButton>
);

const RightAlignButton = ({ handleClick }) => (
  <ToolBarButton id="align-right" handleClick={handleClick}>
    <FormatAlignRightIcon />
  </ToolBarButton>
);

const MergeCellButton = ({ disabled, handleClick }) => (
  <ToolBarButton disabled={disabled} handleClick={handleClick}>
    <MergeTypeIcon />
  </ToolBarButton>
);

const AlignStyles = ({ handleApplyBlockStyle }) => {
  return (
    <div>
      <LeftAlignButton handleClick={handleApplyBlockStyle} />
      <CenterAlignButton handleClick={handleApplyBlockStyle} />
      <RightAlignButton handleClick={handleApplyBlockStyle} />
    </div>
  );
};

const BoldButton = props => (
  <ToolBarButton id="bold" {...props}>
    <FormatBoldIcon />
  </ToolBarButton>
);

const ItalicButton = props => (
  <ToolBarButton id="italic" {...props}>
    <FormatItalicIcon />
  </ToolBarButton>
);

const UnderlineButton = props => (
  <ToolBarButton id="underline" {...props}>
    <FormatUnderlinedIcon />
  </ToolBarButton>
);

const StrikethroughButton = props => (
  <ToolBarButton id="strikethrough" {...props}>
    <FormatStrikeThroguhIcon />
  </ToolBarButton>
);

const FileUpload = () => {
  const dispatch = useDispatch();
  const handleChange = useCallback(
    async ({ target }) => {
      const fileData = target.files[0];

      const { name } = fileData;

      const extension = name.split('.').pop();

      if (extension === 'xlsx' || extension === 'xlsm') {
        // !unoptimized function... since straight conversion to react state doesn't exist at the moment.
        // ! TODO: implement straight conversion from file to react state
        const fileStates = await convertExcelFileToState(fileData);
        const excelReactState = convertStateToReactState(fileStates);

        dispatch(setExcelData(excelReactState));
      }
    },
    [dispatch],
  );

  return (
    <Button component="label">
      <PublishIcon />
      <input type="file" style={{ display: 'none' }} onChange={handleChange} />
    </Button>
  );
};

const CellStyles = ({ isMergeButtonEnabled, isCellMergeable }) => {
  const dispatch = useDispatch();

  const handleMerge = useCallback(() => dispatch(isCellMergeable ? mergeCells() : unmergeCells()), [
    dispatch,
    isCellMergeable,
  ]);

  return (
    <div>
      <MergeCellButton disabled={!isMergeButtonEnabled} handleClick={handleMerge} />
    </div>
  );
};

const MainFontStyles = ({ cellStyles, cellEditor, isEditMode, handleTextStyle }) => {
  const { bold, italic, underline, strikethrough } = isEditMode
    ? getMainFontStyleEditorStates(cellEditor)
    : getMainFontStylesStates(cellStyles);

  return (
    <div>
      <BoldButton state={bold} handleClick={handleTextStyle} />
      <ItalicButton state={italic} handleClick={handleTextStyle} />
      <UnderlineButton state={underline} handleClick={handleTextStyle} />
      <StrikethroughButton state={strikethrough} handleClick={handleTextStyle} />
    </div>
  );
};

const ToolBar = () => {
  const {
    cellStyles,
    cellEditor,
    isCellMergeable,
    isSheetFocused,
    isEditMode,
    isMergeButtonEnabled,
  } = useSelector(
    ({
      ui: {
        excel: {
          present: {
            sheetCellData,
            isSheetFocused,
            activeSelectionArea,
            activeCellPosition: { x, y },
            activeCellInputData: { cellEditor },
            stagnantSelectionAreas,
            isEditMode,
          },
        },
      },
    }) => ({
      isMergeButtonEnabled:
        (!stagnantSelectionAreas.length && activeSelectionArea) ||
        (stagnantSelectionAreas.length === 1 && !activeSelectionArea) ||
        (sheetCellData[y] &&
          sheetCellData[y][x] &&
          sheetCellData[y][x].merged &&
          !activeSelectionArea &&
          !stagnantSelectionAreas.length),
      isCellMergeable: stagnantSelectionAreas.length === 1 || activeSelectionArea,
      isEditMode,
      isSheetFocused,
      cellEditor,
      cellStyles:
        sheetCellData[y] && sheetCellData[y][x] && sheetCellData[y][x].styles
          ? sheetCellData[y][x].styles
          : {},
    }),
    shallowEqual,
  );

  const handleApplyBlockStyle = ({ currentTarget: { id } }) => {};
  const handleTextStyle = ({ currentTarget: { id } }) => {};

  return (
    <div className="toolBar">
      <MainFontStyles
        cellStyles={cellStyles}
        cellEditor={cellEditor}
        isEditMode={isEditMode}
        handleTextStyle={handleTextStyle}
      />
      <Divider orientation="vertical" />
      <AlignStyles handleApplyBlockStyle={handleApplyBlockStyle} cellStyles={cellStyles} />
      <Divider orientation="vertical" />
      <CellStyles isMergeButtonEnabled={isMergeButtonEnabled} isCellMergeable={isCellMergeable} />
      <Divider orientation="vertical" />
      <FileUpload />
    </div>
  );
};

export default ToolBar;
