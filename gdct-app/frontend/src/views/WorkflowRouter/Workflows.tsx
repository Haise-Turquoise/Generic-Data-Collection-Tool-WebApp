import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MaterialTable, { Action, Column, Options } from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

//@ts-ignore
import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
//@ts-ignore
import { ROUTE_WORKFLOW_CREATE, ROUTE_WORKFLOW } from '../../constants/routes';
//@ts-ignore
import { getWorkflowsRequest, deleteWorkflowRequest } from '../../store/thunks/workflow';
//@ts-ignore
import { calculateOptions } from '../../tools/misc';

import moment from 'moment';
//@ts-ignore
import ErrorBanner from '../ErrorBanner';
//@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
//@ts-ignore
import workflowController from '../../controllers/workflow';

import Workflow from '../../types/workflow';

interface WorkflowMT extends Workflow {
  tableData?: any;
}

const WorkflowHeader = () => {
  const history = useHistory();
  const handleCreate = () => history.push(ROUTE_WORKFLOW_CREATE);

  return (
    <Paper className="header">
      <Typography variant="h5">Workflow</Typography>
      <Button variant="contained" color="primary" onClick={handleCreate}>
        Create
      </Button>
    </Paper>
  );
};

const Workflows = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [readRowNum, setRowNum] = useState(1);
  const [hasWorkflows, setHasWorkflows] = useState(false);

  // table vars for loading
  const preColumns: Column<WorkflowMT>[] = [{ title: 'Name', field: 'name' }];
  const preWorkflows: WorkflowMT[] = [
    {
      name: 'LOADING...',
      _id: '',
      timestamp: '',
      updatedBy: '',
      isActive: true,
    },
  ];

  const { workflows }: { workflows: Workflow[] } = useSelector(
    state => ({
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  workflows.forEach(workflow => {
    const logtime = new Date(workflow.timestamp);
    workflow.timestamp = moment(logtime).format('YYYY-MM-DD HH:mm:ss');
  });

  const columns: Column<WorkflowMT>[] = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      {
        title: 'Modified On',
        field: 'timestamp',
        editComponent: () => {
          return <div></div>;
        },
      },
      {
        title: 'Updated By',
        field: 'updatedBy',
        editComponent: () => {
          return <div></div>;
        },
      },
    ],
    [],
  );

  const options: Options<WorkflowMT> = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs
  function recordUpdate(workflow: WorkflowMT) {
    workflow.updatedBy = localStorage.getItem('currentUser') || '';
    workflow.timestamp = new Date().toLocaleString();
  }
  const editable = useMemo(
    () => ({
      onRowDelete: (workflow: WorkflowMT) =>
        new Promise((resolve, reject) => {
          recordUpdate(workflow);
          dispatch(deleteWorkflowRequest(workflow._id, resolve, reject));
        }).then(() => {
          (async () => {
            const oldWorkflow = await workflowController.fetchOnlyWorkflowById(workflow._id);
            if (oldWorkflow.length === 0) {
              CreateAuditLog(null, 'Delete Workflow', 'Workflow', workflow._id, workflow, {});
            }
          })();
        }),
    }),
    [dispatch],
  );

  const actions: Action<WorkflowMT>[] = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Workflow',
        onClick: (_: any, workflow: Workflow | Workflow[]) => {
          if (!Array.isArray(workflow)) {
            history.push(`${ROUTE_WORKFLOW}/${workflow._id}`);
          }
        },
      },
    ],
    [history],
  );

  useEffect(() => {
    console.log('page refresh');
    dispatch(getWorkflowsRequest());
  }, [dispatch]);

  useEffect(() => {
    setRowNum(workflows.length);
    if (!hasWorkflows) {
      setHasWorkflows(workflows.length >= 1);
    }
  }, [workflows]);

  return (
    <div>
      <WorkflowHeader />
      <ErrorBanner
        title={'You cannnot delete this workflow because it is refernced in template type.'}
        targetStore={selectWorkflowsStore}
      />
      <MaterialTable
        key={readRowNum}
        columns={hasWorkflows ? columns : preColumns}
        data={hasWorkflows ? workflows : preWorkflows}
        editable={hasWorkflows ? editable : undefined}
        options={options}
        actions={hasWorkflows ? actions : undefined}
      />
    </div>
  );
};

export default Workflows;
