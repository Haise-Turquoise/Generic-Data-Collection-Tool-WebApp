import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
//@ts-ignore
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getProgramsRequest } from '../../store/thunks/program';
//@ts-ignore
import { selectIsProgramDialogOpen } from '../../store/DialogsStore/selectors';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectProgramsStore } from '../../store/ProgramsStore/selectors';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
import Program from '../../types/program';
import { state } from '../../store/types';
const ProgramDialog = ({ selectedPrograms, handleChange, shouldClose = true }:{
  selectedPrograms:Program[],
  handleChange:(data:Program)=>void,
  shouldClose:boolean,
}) => {
  const dispatch = useDispatch();

  const { isProgramDialogOpen, programs } = useSelector(
    (state: state) => ({
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
      handleChange(data);
      if (shouldClose) handleClose();
    },
    [dispatch, shouldClose, handleChange],
  );

  useEffect(() => {
    if (isProgramDialogOpen && !programs.length) dispatch(getProgramsRequest());
  }, [dispatch, isProgramDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  const getKey:any = selectedPrograms ? (t:Program) => t._id : undefined;
  
  // Sort the programs alphabaticly 
  const sortedPrograms = programs.sort((a:Program, b:Program)=>a.name.localeCompare(b.name))

  return (
    <SelectableTableDialog
      title="Program"
      columns={columns}
      isOpen={isProgramDialogOpen}
      data={sortedPrograms}
      getKey={getKey}
      selectedKeys={selectedPrograms}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default ProgramDialog;
