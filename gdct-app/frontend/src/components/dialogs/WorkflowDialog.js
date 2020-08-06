import React, { useCallback, useEffect, useMemo } from 'react';

import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import SelectableTableDialog from './SelectableTableDialog';

import { getWorkflowsRequest } from '../../store/thunks/workflow';

import DialogsStore from '../../store/DialogsStore/store';
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
import { selectIsWorkflowDialogOpen } from '../../store/DialogsStore/selectors';

const WorkflowDialog = ({ selectedWorkflows, handleChange, shouldClose = true }) => {
  const dispatch = useDispatch();

  const { isWorkflowDialogOpen, workflows } = useSelector(
    state => ({
      isWorkflowDialogOpen: selectIsWorkflowDialogOpen(state),
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );

  const handleClose = useCallback(() => dispatch(DialogsStore.actions.CLOSE_WORKFLOW_DIALOG()), [
    dispatch,
  ]);

  const handleSelect = data => {
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

  const getKey = selectedWorkflows ? t => t._id : undefined;

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
