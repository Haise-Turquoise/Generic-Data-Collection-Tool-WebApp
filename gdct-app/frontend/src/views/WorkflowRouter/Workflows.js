import React, { useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';

import MaterialTable from 'material-table';
import { Paper, Typography, Button } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';

import { selectFactoryRESTResponseTableValues } from '../../store/common/REST/selectors';
import { selectWorkflowsStore } from '../../store/WorkflowsStore/selectors';
import { ROUTE_WORKFLOW_CREATE, ROUTE_WORKFLOW } from '../../constants/routes';
import { getWorkflowsRequest, deleteWorkflowRequest } from '../../store/thunks/workflow';
import { calculateOptions } from '../../tools/misc';

import moment from 'moment';
import ErrorBanner from '../ErrorBanner';
import CreateAuditLog from '../AuditLog_Global';
import workflowController from '../../controllers/workflow';

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

  const { workflows } = useSelector(
    state => ({
      workflows: selectFactoryRESTResponseTableValues(selectWorkflowsStore)(state),
    }),
    shallowEqual,
  );
  // Convert Date format
  workflows.forEach(workflow => {
    const logtime = new Date(workflow.timestamp);
    workflow.timestamp = moment(logtime).format("YYYY-MM-DD HH:mm:ss")
  });

  const columns = useMemo(
    () => [
      { title: 'Name', field: 'name' },
      { title: 'Modified On', field: 'timestamp', editComponent: () => {return <div></div>} },
      { title: 'Updated By', field: 'updatedBy', editComponent: () => {return <div></div>} },
    ],
    []
  );

  const options = useMemo(() => calculateOptions(readRowNum), [readRowNum]);

  // Record user and time when an action occurs
  function recordUpdate(workflow) {
    workflow.updatedBy = localStorage.getItem('currentUser');
    workflow.timestamp = new Date().toLocaleString(); 
  }
  const editable = useMemo(
    () => ({
      onRowDelete: workflow =>
        new Promise((resolve, reject) => {
          recordUpdate(workflow);
          dispatch(deleteWorkflowRequest(workflow._id, resolve, reject));
        }).then(() => {
          (async () => {
            const oldWorkflow = await workflowController.fetchOnlyWorkflowById(workflow._id);
            if (oldWorkflow.length === 0) {
              CreateAuditLog(null, "Delete Workflow", "Workflow", workflow._id, workflow, {});
            }
          })();
        }),
    }),
    [dispatch],
  );

  const actions = useMemo(
    () => [
      {
        icon: LaunchIcon,
        tooltip: 'Open Workflow',
        onClick: (_event, workflow) => history.push(`${ROUTE_WORKFLOW}/${workflow._id}`),
      },
    ],
    [history],
  );

  useEffect(() => {
    dispatch(getWorkflowsRequest());
  }, [dispatch]);

  useEffect(()=>{setRowNum(workflows.length)}, [workflows])

  return (
    <div>
      <WorkflowHeader />
      <ErrorBanner title={"You cannnot delete this workflow because it is refernced in template type."} targetStore={selectWorkflowsStore}/>
      <MaterialTable
        key={readRowNum} 
        columns={columns}
        data={workflows}
        editable={editable}
        // @ts-ignore
        options={options}
        actions={actions}
      />
    </div>
  );
};

export default Workflows;
