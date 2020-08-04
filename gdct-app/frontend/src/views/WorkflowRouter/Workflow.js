import React, { useEffect, useMemo, useCallback } from 'react';
import { FlowChart, actions, REACT_FLOW_CHART } from '@mrblenny/react-flow-chart';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import Listitem from '@material-ui/core/ListItem';
import { mapValues } from 'lodash';
import { Typography, Button } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import { selectFactoryRESTResponseValues } from '../../store/common/REST/selectors';
import { selectStatusesStore } from '../../store/StatusesStore/selectors';
import { getStatusesRequest } from '../../store/thunks/status';
import { StatusesStoreActions } from '../../store/StatusesStore/store';

import {
  selectWorkflowChart,
  selectSelectedNodeId,
  selectSelectedNodeValue,
  selectWorkflowFilter,
  selectWorkflowName,
} from '../../store/WorkflowStore/selectors';
import { WorkflowStoreActions } from '../../store/WorkflowStore/store';
import { submitWorkflow, updateWorkflow, loadWorkflow } from '../../store/thunks/workflow';
import './Workflow.scss';

const NodeInnerCustom = ({ node }) => <div className="workflowNode">{node.type.name}</div>;

const createNodeDragData = (_id, name) =>
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

const StatusItems = ({ statuses }) => (
  <List className="statuses">
    {statuses.map(({ _id, name }) => (
      <Listitem
        className="statuses__status"
        key={_id}
        button
        draggable={true}
        onDragStart={event => {
          event.dataTransfer.setData(REACT_FLOW_CHART, createNodeDragData(_id, name));
        }}
      >
        {name}
      </Listitem>
    ))}
  </List>
);

const SelectedNodeActions = ({ value, stateActions }) => (
  <div className="sections">
    <Typography gutterBottom>{value}</Typography>
    <Button
      onClick={() => stateActions.onDeleteKey({})}
      color="secondary"
      variant="contained"
      fullWidth
    >
      Delete
    </Button>
  </div>
);

const SelectedNode = ({ stateActions }) => {
  const { selectedNodeId, selectedNodeValue } = useSelector(
    state => ({
      selectedNodeId: selectSelectedNodeId(state),
      selectedNodeValue: selectSelectedNodeValue(state),
    }),
    shallowEqual,
  );

  if (!selectedNodeId) return null;

  return (
    selectedNodeId && <SelectedNodeActions stateActions={stateActions} value={selectedNodeValue} />
  );
};

const WorkflowStatuses = () => {
  const dispatch = useDispatch();
  let { statuses, workflowFilter } = useSelector(
    state => ({
      statuses: selectFactoryRESTResponseValues(selectStatusesStore)(state),
      workflowFilter: selectWorkflowFilter(state),
      name: selectWorkflowName,
    }),
    shallowEqual,
  );

  statuses = useMemo(
    () => statuses.filter(({ name }) => name.toLowerCase().includes(workflowFilter.toLowerCase())),
    [statuses, workflowFilter],
  );

  useEffect(() => {
    dispatch(getStatusesRequest());

    return () => {
      dispatch(StatusesStoreActions.RESET());
    };
  }, []);

  const handleChangeFilter = useCallback(
    ({ target: { value } }) => dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_FILTER(value)),
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
        placeholder="Search statuses..."
        onChange={handleChangeFilter}
      />
      <StatusItems statuses={statuses} />
    </div>
  );
};

const WorkflowSideBar = ({ stateActions }) => (
  <div className="workflowPicker">
    <WorkflowStatuses />
    <SelectedNode stateActions={stateActions} />
  </div>
);

const WorkflowPane = ({ stateActions }) => {
  const chart = useSelector(state => selectWorkflowChart(state), shallowEqual);

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
      Components={{
        NodeInner: NodeInnerCustom,
      }}
    />
  );
};

const WorkflowHeaderActions = ({ type }) => {
  const dispatch = useDispatch();
  // submitWorkflow

  const handleSave = useCallback(() => {
    dispatch(type === 'create' ? submitWorkflow() : updateWorkflow());
  }, [dispatch]);

  return (
    <div>
      <Button color="primary" variant="contained" onClick={handleSave}>
        Save
      </Button>
    </div>
  );
};

const WorkflowHeader = ({ type }) => {
  const dispatch = useDispatch();

  const name = useSelector(state => selectWorkflowName(state), shallowEqual);

  const handleChangeName = useCallback(
    ({ target: { value } }) => dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_NAME(value)),
    [dispatch],
  );

  return (
    <div className="workflowHeader">
      <TextField
        variant="outlined"
        size="small"
        placeholder="Name"
        value={name}
        onChange={handleChangeName}
      />
      <WorkflowHeaderActions type={type} />
    </div>
  );
};

const Workflow = () => {
  const dispatch = useDispatch();

  const stateActions = useMemo(
    () =>
      mapValues(actions, func => (...args) =>
        dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_CHART(func(...args))),
      ),
    [dispatch, actions],
  );

  return (
    <div className="workflow">
      <WorkflowPane stateActions={stateActions} />
      <WorkflowSideBar stateActions={stateActions} />
    </div>
  );
};

const WorkflowContainer = ({ type }) => {
  const dispatch = useDispatch();
  const {
    params: { _id },
  } = useRouteMatch();

  useEffect(() => {
    if (_id) dispatch(loadWorkflow(_id));

    return () => dispatch(WorkflowStoreActions.RESET());
  }, [dispatch]);

  return (
    <div className="workflowContainer">
      <WorkflowHeader type={type} />
      <Workflow type={type} />
    </div>
  );
};

export default WorkflowContainer;
