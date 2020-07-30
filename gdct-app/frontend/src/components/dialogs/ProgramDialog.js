import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';

import { getProgramsRequest } from '../../store/thunks/program';

import { selectIsProgramDialogOpen } from '../../store/DialogsStore/selectors';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
import DialogsStore from '../../store/DialogsStore/store';

const ProgramDialog = ({ handleChange }) => {
  const dispatch = useDispatch();

  const { isProgramDialogOpen, programs } = useSelector(
    state => ({
      isProgramDialogOpen: selectIsProgramDialogOpen(state),
      programs: selectFactoryRESTResponseTableValues(selectProgramsStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_PROGRAM_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = useCallback(
    data => {
      handleChange(data._id);
      handleClose();
    },
    [dispatch],
  );

  useEffect(() => {
    if (isProgramDialogOpen && !programs.length) dispatch(getProgramsRequest());
  }, [dispatch, isProgramDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: '_id',
        field: '_id',
      },
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  return (
    <SelectableTableDialog
      title="Program"
      columns={columns}
      isOpen={isProgramDialogOpen}
      data={programs}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default ProgramDialog;
