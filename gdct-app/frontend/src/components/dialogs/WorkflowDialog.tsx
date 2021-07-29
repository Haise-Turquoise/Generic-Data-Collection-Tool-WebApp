import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';
//@ts-ignore
import { getWorkflowsRequest } from '../../store/thunks/workflow';
//@ts-ignore
import DialogsStore from '../../store/DialogsStore/store';
//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
//@ts-ignore
import { selectIsWorkflowDialogOpen } from '../../store/DialogsStore/selectors';
import Workflow from '../../types/workflow';
import { state } from '../../store/types';
const WorkflowDialog = ({ selectedWorkflows, handleChange, shouldClose = true }:
  {selectedWorkflows:Workflow[], handleChange:(data:Workflow)=>void, shouldClose:boolean}
  ) => {
  const dispatch = useDispatch();

  const { isWorkflowDialogOpen, workflows } = useSelector(
    (state: state) => ({
      isWorkflowDialogOpen: selectIsWorkflowDialogOpen(state),
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_WORKFLOW_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = (data:Workflow) => {
    handleChange(data);
    if (shouldClose) handleClose();
  };

  useEffect(() => {
    if (isWorkflowDialogOpen) dispatch(getWorkflowsRequest());
  }, [dispatch, isWorkflowDialogOpen]);

  const columns = useMemo(
    () => [
      {
        title: 'Name',
        field: 'name',
      },
    ],
    [],
  );

  const getKey:any = selectedWorkflows ? (t:Workflow) => t._id : undefined;

  return (
    <SelectableTableDialog
      title="Workflow"
      columns={columns}
      isOpen={isWorkflowDialogOpen}
      data={workflows}
      selectedKeys={selectedWorkflows}
      getKey={getKey}
      handleClose={handleClose}
      handleSelect={handleSelect}
    />
  );
};

export default WorkflowDialog;
