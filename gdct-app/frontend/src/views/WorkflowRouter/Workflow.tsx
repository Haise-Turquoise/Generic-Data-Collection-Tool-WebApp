import React, { useEffect, useMemo, useCallback } from 'react';
import {
  FlowChart,
  actions,
  REACT_FLOW_CHART,
  IFlowChartCallbacks,
  INodeDefaultProps,
  INode,
  INodeInnerDefaultProps,
} from '@mrblenny/react-flow-chart';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { TextField, List, ListItem, Typography, Button } from '@material-ui/core';
import { mapValues } from 'lodash';
import { useRouteMatch, useHistory } from 'react-router-dom';
//@ts-ignore
import { selectFactoryRESTResponseValues } from '../../store/common/REST/selectors';
//@ts-ignore
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
//@ts-ignore
import { getStatusesRequest } from '../../store/thunks/status';
//@ts-ignore
import { StatusesStoreActions } from '../../store/StatusesStore/store';

import {
  selectWorkflowChart,
  selectSelectedNodeId,
  selectSelectedNodeValue,
  selectWorkflowFilter,
  selectWorkflowName,
  //@ts-ignore
} from '../../store/WorkflowStore/selectors';
//@ts-ignore
import { WorkflowStoreActions } from '../../store/WorkflowStore/store';
//@ts-ignore
import { submitWorkflow, updateWorkflow, loadWorkflow } from '../../store/thunks/workflow';
//@ts-ignore
import { getWorkflowsRequest, deleteWorkflowRequest } from '../../store/thunks/workflow';
//@ts-ignore
import SubmissionController from '../../controllers/submission'
import './Workflow.scss';

import Swal from 'sweetalert2'

import Status from '../../types/status';
import Submission from '../../types/submission'
type actionType = 'create' | 'update';

//@ts-ignore
import CreateAuditLog from '../AuditLog_Global';
import { state } from '../../store/types';
import { Node } from '../../types/workflow';

const Auditlog_Operation: string[] = [];

// The Save button and its logic in the header
const WorkflowHeaderActions = ({ type, id }: { type: actionType; id: string }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const setWorkflows = async () => {
    // check if workflow is referenced in submission before updating
    if (type === 'update') {
      const res: Submission[] | null = await SubmissionController.fetch({ workflowId: id })
      // needs testing
      if (res && res!.length >= 1) {
        Swal.fire({
          title: 'Error updating workflow',
          text: 'Workflow is already referenced in submissions',
          icon: 'warning'
        })
        return false
      } else {
        dispatch(updateWorkflow())
        return true
      }
    } else {
      dispatch(submitWorkflow())
      return true
    }
  }

  const handleSave = useCallback(() => {
    setWorkflows().then(res => {
      if (!res) {
        return
      }
      dispatch(getWorkflowsRequest())
      // For AuditLog
      const Auditlog_Message = type === 'create' ? 'Create Workflow' : 'Update Workflow';
      CreateAuditLog(
        null,
        Auditlog_Message,
        'Workflow',
        id,
        { 0: 'More Information In Workflow.' },
        Auditlog_Operation,
      );
      // Redirect back
      history.push('/admin/workflow');
    })
  }, [dispatch]);

  return (
    <div>
      <Button color="primary" variant="outlined" onClick={() => {history.push('/admin/workflow')}}>
        Back
      </Button>
      <Button color="primary" variant="contained" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

// The Header for workflow, including the name input field.
const WorkflowHeader = ({ type, id }: { type: actionType; id: string }) => {
  const dispatch = useDispatch();

  let name = useSelector((state: state) => selectWorkflowName(state), shallowEqual);
  const handleChangeName = useCallback(
    ({ target: { value } }) => {
      dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_NAME(value));

      // Delete previous name change record for only auditting the newest name change
      for (let i = 0; i < Auditlog_Operation.length; i++) {
        if (Auditlog_Operation[i].slice(0, 4) === 'Name') {
          Auditlog_Operation.splice(i, 1);
        }
      }
      Auditlog_Operation.push(`Name Changed To: ${value}`);
    },
    [dispatch],
  );
  return (
    <div className="workflowHeader">
      <TextField
        variant="outlined"
        size="small"
        placeholder="Name of your workflow"
        value={name}
        onChange={handleChangeName}
      />
      <WorkflowHeaderActions type={type} id={id} />
    </div>
  );
};

const createNodeDragData = (_id: string, name: string) =>
  JSON.stringify({
    type: { _id, name },
    ports: {
      port1: {
        id: 'port1',
        type: 'input',
      },
      port2: {
        id: 'port2',
        type: 'output',
      },
    },
    properties: {
      label: 'example link label',
    },
  });

// The list component for statuses in status picker
const StatusItems = ({ statuses }: { statuses: Status[] }) => (
  <List className="statuses">
    {statuses.map(({ _id, name }) => (
      <ListItem
        className="statuses__status"
        key={_id}
        
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData(REACT_FLOW_CHART, createNodeDragData(_id, name));
          Auditlog_Operation.push(`Added Node ${name}`);
        }}
      >
        {name}
      </ListItem>
    ))}
  </List>
);

// Left click on node will generate a box of potential actions that could be performed to the node under the list of statuses.
const SelectedNodeActions = ({
  value,
  stateActions,
}: {
  value: string;
  stateActions: IFlowChartCallbacks;
}) => (
  <div className="sections">
    <Typography gutterBottom>{value}</Typography>
    <Button
      onClick={() => {
        stateActions.onDeleteKey({});
        Auditlog_Operation.push(`Deleted Node ${value}`);
      }}
      color="secondary"
      variant="contained"
      fullWidth
    >
      Delete
    </Button>
  </div>
);
const SelectedNode = ({ stateActions }: { stateActions: IFlowChartCallbacks }) => {
  const { selectedNodeId, selectedNodeValue } = useSelector(
    (state: state) => ({
      selectedNodeId: selectSelectedNodeId(state),
      selectedNodeValue: selectSelectedNodeValue(state),
    }),
    shallowEqual,
  );
  if (!selectedNodeId) return null;
  return (
    selectedNodeId && <SelectedNodeActions stateActions={stateActions} value={selectedNodeValue || ''} />
  );
};

// Status Picker for Workflow
const WorkflowStatuses = () => {
  const dispatch = useDispatch();
  let { statuses, workflowFilter } = useSelector(
    (state: state) => ({
      statuses: selectFactoryRESTResponseValues(selectStatusesStore)(state),
      workflowFilter: selectWorkflowFilter(state),
      name: selectWorkflowName,
    }),
    shallowEqual,
  );

  // helper function for filtering valid statuses
  const filterStatus = ({ name, isActive, forPackage }: Status) => {
    return name.toLowerCase().includes(workflowFilter.toLowerCase()) && isActive && !forPackage;
  };

  statuses = useMemo(() => statuses.filter(filterStatus), [statuses, workflowFilter]);
  useEffect(() => {
    dispatch(getStatusesRequest());

    return () => {
      dispatch(StatusesStoreActions.RESET(''));
    };
  }, []);

  const handleChangeFilter = useCallback(
    ({ target: { value } }) => {
      dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_FILTER(value));
    },
    [dispatch],
  );

  return (
    <div className="sections">
      <Typography className="workflowPicker__title" variant="h5">
        Status Picker
      </Typography>
      <TextField
        className="workflowPicker__search"
        variant="outlined"
        size="small"
        placeholder="Search for a status..."
        onChange={handleChangeFilter}
      />
      <StatusItems statuses={statuses} />
    </div>
  );
};

// The status picker and potential actions box
const WorkflowSideBar = ({ stateActions }: { stateActions: IFlowChartCallbacks }) => (
  <div className="workflowPicker">
    <WorkflowStatuses />
    <SelectedNode stateActions={stateActions} />
  </div>
);

const NodeInnerCustom = ({ node }: {node: Node}) => {
  const name = typeof node.type === 'string' ? node.type : node.type.name
  return <div className="workflowNode">{name}</div>
};

// The flow chart of workflow
const WorkflowPane = ({ stateActions }: { stateActions: IFlowChartCallbacks }) => {
  const chart = useSelector((state: state) => selectWorkflowChart(state), shallowEqual);

  return (
    <FlowChart
      chart={chart}
      callbacks={stateActions}
      config={{
        validateLink: ({ fromNodeId, toNodeId, chart }) => {
          // no links between same type nodes
          return chart.nodes[fromNodeId].type !== chart.nodes[toNodeId].type;
        },
      }}
      Components={{ NodeInner: NodeInnerCustom }}
    />
  );
};

// The flow chart and the status picker
const Workflow = () => {
  const dispatch = useDispatch();

  const stateActions: IFlowChartCallbacks = useMemo(
    () =>
      mapValues(actions, func => (...args: any) => {
        // @ts-ignore
        dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_CHART(func(...args)));
      }),
    [dispatch, actions],
  );

  return (
    <div className="workflow">
      <div className="scroll-bar">
        <WorkflowPane stateActions={stateActions} />
      </div>
      <WorkflowSideBar stateActions={stateActions} />
    </div>
  );
};

const WorkflowContainer = ({ type }: { type: actionType }) => {
  const dispatch = useDispatch();
  // Get the workflow id inside the url
  // @ts-ignore
  const {
    params: { _id },
  }: {params: {_id: string}} = useRouteMatch();

  useEffect(() => {
    if (_id) dispatch(loadWorkflow(_id));

    return () => {
      dispatch(WorkflowStoreActions.RESET());
    }
  }, [dispatch]);

  return (
    <div className="workflowContainer">
      <WorkflowHeader type={type} id={_id} />
      <Workflow />
    </div>
  );
};

export default WorkflowContainer;
