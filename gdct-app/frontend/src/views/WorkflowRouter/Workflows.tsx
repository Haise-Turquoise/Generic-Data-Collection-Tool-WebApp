import React, { useMemo, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import MaterialTable, { Action, Column, Options } from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
import { ROUTE_WORKFLOW_CREATE, ROUTE_WORKFLOW } from '../../constants/routes';
import {
  calculateOptions,
  controllerDeleteRow,
  formatTimestamp,
  fetchWithStatus,
} from '../../tools/misc';
import ErrorBanner from '../ErrorBanner';
import CreateAuditLog from '../AuditLog_Global';
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
  const history = useHistory();
  const [readRowNum, setRowNum] = useState(1);
  const [workflows, setWorkflows] = useState<Workflow[] | undefined>(undefined)
  const [status, setStatus] = useState<'LOADING...' | 'NOT ALLOWED'>('LOADING...')

  useEffect(() => {
    fetchWithStatus<Workflow>(workflowController, setWorkflows, setStatus)
  }, [])

  // table vars for loading
  const preColumns: Column<WorkflowMT>[] = [{ title: 'Name', field: 'name' }];
  const preWorkflows: WorkflowMT[] = [
    {
      name: status,
      _id: '',
      timestamp: '',
      updatedBy: '',
      isActive: true,
    },
  ];

  // Convert Date format
  workflows?.forEach(workflow => {
    workflow.timestamp = formatTimestamp(workflow.timestamp);
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
          controllerDeleteRow(workflowController, setWorkflows, workflow._id)
            .then((res: boolean) => {
              if (res) {
                resolve(res)
              }
              reject()
            })
        }).then(() => {
          (async () => {
            const oldWorkflow = await workflowController.fetchOnlyWorkflowById(workflow._id);
            if (oldWorkflow) {
              CreateAuditLog(null, 'Delete Workflow', 'Workflow', workflow._id, workflow, {});
            }
          })();
        }),
    }),
    [],
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

  useEffect(()=>{
    setRowNum(workflows?.length || 1)
  }, [workflows])

  return (
    <div>
      <WorkflowHeader />
      <ErrorBanner
        title={'You cannnot delete this workflow because it is refernced in template type.'}
        targetStore={selectWorkflowsStore}
      />
      <MaterialTable
        key={readRowNum} 
        columns={!!workflows ? columns : preColumns}
        data={!!workflows ? workflows : preWorkflows}
        editable={!!workflows ? editable : undefined}
        options={options}
        actions={!!workflows ? actions : undefined}
      />
    </div>
  );
};

export default Workflows;
