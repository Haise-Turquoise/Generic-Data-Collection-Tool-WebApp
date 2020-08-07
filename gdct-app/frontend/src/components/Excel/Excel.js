import React, { useRef, useCallback, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import AppBar from './AppBar';
import ToolBar from './ToolBar';
import FormulaBar from './FormulaBar';
import Sheet from './Sheet';
import SheetNavigator from './SheetNavigator';

import { undo, redo, resetExcelData } from '../../store/actions/ui/excel/commands';

import './Excel.scss';

const Divider = () => <hr className="divider" />;

const Excel = ({ type, returnLink, handleSave }) => {
  const sheetContainerRef = useRef(null);
  const sheetGridRef = useRef(null);

  const dispatch = useDispatch();

  window.sheetGridRef = sheetGridRef;
  window.sheetContainerRef = sheetContainerRef;

  const handleKeyDown = useCallback(
    ({ key, ctrlKey, metaKey }) => {
      if (ctrlKey || metaKey) {
        if (key === 'y') {
          dispatch(redo());
        } else if (key === 'z') {
          dispatch(undo());
        }
      }
    },
    [dispatch],
  );

  useEffect(() => {
    return () => {
      dispatch(resetExcelData());
    };
  }, [dispatch]);

  return (
    <div className="excel" onKeyDown={handleKeyDown}>
      <AppBar type={type} returnLink={returnLink} handleSave={handleSave} />
      <Divider />
      <ToolBar type={type} />
      <Divider />
      <FormulaBar />
      <Divider />
      <Sheet sheetGridRef={sheetGridRef} handleSave={handleSave} />
      <Divider />
      <SheetNavigator />
    </div>
  );
};

export default Excel;
