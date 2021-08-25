import { cloneDeep } from 'lodash';
//@ts-ignore
import uniqid from 'uniqid';
import WorkflowsStore from '../WorkflowsStore/store';
import workflowController from '../../controllers/workflow';
import {
  selectWorkflowLinks,
  selectWorkflowNodes,
  selectWorkflowName,
  selectWorkflowId,
  selectWorkflowTimestamp,
  selectWorkflowUpdatedBy,
} from '../WorkflowStore/selectors';
import { WorkflowStoreActions, initialWorkflowState } from '../WorkflowStore/store';

import { getRequestFactory, deleteRequestFactory, updateRequestFactory } from './common/REST';
import WorkflowProcessesStore from '../WorkflowProcessesStore/store';
import { Dispatch } from 'redux';
import { state } from '../types';
import Workflow, { WorkflowData } from '../../types/workflow';
import WorkflowProcess from '../../types/workflowprocess';

export const getWorkflowsRequest = getRequestFactory(WorkflowsStore, workflowController);

export const deleteWorkflowRequest = deleteRequestFactory(WorkflowsStore, workflowController);

export const updateWorkflowRequest = updateRequestFactory(WorkflowsStore, workflowController);

type LinkMapSetType = {[key: string]: Set<string>}

const _createWorkflow = (dispatch: Dispatch, getState: () => state): WorkflowData | null => {
  const state = getState();

  const workflowNodes = selectWorkflowNodes(state);
  const workflowLinks = selectWorkflowLinks(state);
  const workflowName = selectWorkflowName(state);
  const workflowId = selectWorkflowId(state);
  const workflowTimestamp = selectWorkflowTimestamp(state);
  const workflowUpdatedBy = selectWorkflowUpdatedBy(state);

  const linkMapSet: LinkMapSetType = {};
  const endNodes: Set<string> = new Set();
  const startNodes: Set<string> = new Set();

  for (const link in workflowLinks) {
    const { from, to } = workflowLinks[link];
    const fromId = from.nodeId;
    const toId = to.nodeId;

    if (!linkMapSet[fromId]) linkMapSet[fromId] = new Set();

    linkMapSet[fromId].add(toId);
    endNodes.add(toId);
    startNodes.add(fromId);
  }
  let initialNode: any = null;
  let isSingleInitialNode = true;
  startNodes.forEach(node => {
    if (!endNodes.has(node)) {
      if (initialNode) {
        isSingleInitialNode = false;
      } else {
        initialNode = node;
      }
    }
  });

  if (!isSingleInitialNode || !Object.keys(workflowNodes).length) {
    dispatch(
      WorkflowStoreActions.UPDATE_WORKFLOW_ERROR('There must be only one starting node'),
    );
    return null
  }

  const visited = new Set<string>();

  markVisitableNodes(initialNode, linkMapSet, visited);

  let isGraphConnected = true;
  for (const node in workflowNodes) {
    if (!visited.has(node)) {
      isGraphConnected = false;
      break;
    }
  }

  if (!isGraphConnected) {
    dispatch(
      WorkflowStoreActions.UPDATE_WORKFLOW_ERROR(
        'Graphs must be connected and have at least two nodes',
      ),
    );
    return null
  }

  // Create the data structure of workflow process
  const workflow: Workflow = {
    name: workflowName,
    _id: workflowId || '',
    updatedAt: workflowTimestamp.toString(),
    updatedBy: workflowUpdatedBy,
    isActive: true,
  };
  const workflowProcessesData: WorkflowProcess[] = [];
  const statusData = [];

  for (const nodeId in workflowNodes) {
    const node = workflowNodes[nodeId];
    const {
      type: { _id: statusId },
    } = workflowNodes[nodeId];
    statusData.push({ id: nodeId, statusId, position: node.position });
  }

  for (const linkId in linkMapSet) {
    const node = workflowNodes[linkId];
    workflowProcessesData.push({
      id: linkId,
      statusId: node.type._id,
      //TODO
      //@ts-ignore why an object? Doesn't match db
      to: [...linkMapSet[linkId]].map(toId => ({
        id: toId,
        statusId: workflowNodes[toId].type._id,
      })),
    });
  }

  return { workflow, workflowProcessesData, statusData };
};

// this is the same as submitWorkflow, see below
export const updateWorkflow = () => (dispatch: Dispatch, getState: () => state) => {
  const workflowData = _createWorkflow(dispatch, getState)
  if (!workflowData) return
  workflowController
    .update(workflowData)
    .catch(error => dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_ERROR(error)));
};

export const submitWorkflow = () => (dispatch: Dispatch, getState: () => state) => {
  const workflowData = _createWorkflow(dispatch, getState)
  if (!workflowData) return
  workflowController
    .create(workflowData)
    .catch(error => dispatch(WorkflowStoreActions.UPDATE_WORKFLOW_ERROR(error)));
};

export const loadWorkflow = (workflowId: string) => (dispatch: Dispatch) => {
  workflowController.fetchById(workflowId).then(workflowData => {
    if (!workflowData) return
    const { workflow, workflowProcesses } = workflowData
    const workflowState = cloneDeep(initialWorkflowState);
    workflowState.name = workflow.name;
    workflowState._id = workflow._id;

    for (const workflowProcess of workflowProcesses) {
      const {
        _id,
        to,
        statusId: { _id: statusId, name },
        position,
      } = workflowProcess;

      workflowState.chart.nodes[_id!] = {
        id: _id,
        position,
        orientation: 0,
        type: {
          _id: statusId,
          name,
        },
        ports: {
          port1: {
            id: 'port1',
            type: 'input',
            position: { x: 100, y: 0 },
          },
          port2: {
            id: 'port2',
            type: 'output',
            position: { x: 100, y: 100 },
          },
        },
        properties: {
          label: 'example link label',
        },
        size: { width: 200, height: 100 },
      };

      for (const connectionId of to) {
        const linkId = uniqid();
        workflowState.chart.links[linkId] = {
          id: linkId,
          from: {
            nodeId: _id,
            portId: 'port2',
          },
          to: {
            nodeId: connectionId,
            portId: 'port1',
          },
        };
      }
    }

    dispatch(WorkflowStoreActions.UPDATE(workflowState));
  });
};

const markVisitableNodes = (startingNode: string, linkMapSet: LinkMapSetType, visited: Set<string>) => {
  visited.add(startingNode);
  const adjacentNodes = linkMapSet[startingNode];

  if (adjacentNodes) {
    adjacentNodes.forEach(adjacentNode => {
      if (!visited.has(adjacentNode)) markVisitableNodes(adjacentNode, linkMapSet, visited);
    });
  }
};

export const getWorkflowProcessesRequest = (
  query: {[key: string]: any},
  resolve?: () => void,
  reject?: () => void,
  isPopulated = false,
) => (dispatch: Dispatch) => {
  dispatch(WorkflowProcessesStore.actions.REQUEST(''));

  workflowController
    .fetchProcesses()
    .then(values => {
      dispatch(WorkflowProcessesStore.actions.RECEIVE(values));
      if (resolve) resolve();
    })
    .catch(error => {
      console.error(error);
      dispatch(WorkflowProcessesStore.actions.FAIL_REQUEST(error));
      if (reject) reject();
    });
};
