import React, { useState, useCallback } from 'react';

import { useDispatch } from 'react-redux';
import Typography from '@material-ui/core/Typography';

import { LabeledTextField, DialogActions } from './components';

import {
  setPrepopulate,
  resetActiveCellDialog,
} from '../../../../../store/actions/ui/excel/commands';

const PrepopulatePopup = ({ type, quarter, year }) => {
  const dispatch = useDispatch();

  const [newType, setNewType] = useState(type || '');
  const [newQuarter, setNewQuarter] = useState(quarter || '');
  const [newYear, setNewYear] = useState(year || '');

  const handleChangeType = ({ target: { value } }) => setNewType(value);
  const handleChangeQuarter = ({ target: { value } }) => setNewQuarter(value);
  const handleChangeYear = ({ target: { value } }) => setNewYear(value);

  const handleChangePrepopulate = useCallback(
    () =>
      setPrepopulate({
        type: newType,
        quarter: newQuarter,
        year: newYear,
      }),
    [dispatch],
  );

  const handleCloseActiveCellDialog = useCallback(() => dispatch(resetActiveCellDialog()), [
    dispatch,
  ]);

  return (
    <div className="dialog prepopulate">
      <Typography variant="h6">Prepopulate</Typography>
      <LabeledTextField label="Type" text={newType} handleChange={handleChangeType} />
      <LabeledTextField label="Quarter" text={newQuarter} handleChange={handleChangeQuarter} />
      <LabeledTextField label="Year" text={newYear} handleChange={handleChangeYear} />
      <DialogActions
        handleAdd={handleChangePrepopulate}
        handleCancel={handleCloseActiveCellDialog}
      />
    </div>
  );
};

export default PrepopulatePopup;
