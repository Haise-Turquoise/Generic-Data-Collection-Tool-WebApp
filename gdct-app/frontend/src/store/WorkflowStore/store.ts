import { createSlice } from '@reduxjs/toolkit';
import { workflowChart, WorkflowState } from '../types'

export const defaultChart: workflowChart = {
  offset: {
    x: 0,
    y: 0,
  },
  scale: 1,
  nodes: {},
  links: {},
  selected: {},
  hovered: {},
};

export const initialWorkflowState: WorkflowState = {
  chart: defaultChart,
  filter: '',
  name: '',
  error: null,
  _id: null,
  updatedAt: new Date(),
  updatedBy: localStorage.getItem('currentUser') || '',
};

const UPDATE_WORKFLOW_CHART = (state: WorkflowState, action: { payload: (chart: WorkflowState["chart"]) => WorkflowState["chart"] }) => {
  const chart = action.payload(state.chart);

  state.chart = chart;

  return state;
};

const UPDATE_WORKFLOW_FILTER = (state: WorkflowState, action: { payload: WorkflowState["filter"] }) => {
  state.filter = action.payload;
  return state;
};

const UPDATE_WORKFLOW_NAME = (state: WorkflowState, action: { payload: WorkflowState["name"] }) => {
  state.name = action.payload;
  return state;
};

const UPDATE_WORKFLOW_ERROR = (state: WorkflowState, action: { payload: WorkflowState["error"] }) => {
  //@ts-ignore ERROR or error?
  state.ERROR = action.payload;
  return state;
};

const UPDATE_WORKFLOW_TIMESTAMP = (state: WorkflowState, action: { payload: WorkflowState["updatedAt"] }) => {
  state.updatedAt = action.payload;
  return state;
};

const UPDATE_WORKFLOW_UPDATEDBY = (state: WorkflowState, action: { payload: WorkflowState["updatedBy"]}) => {
  state.updatedBy = action.payload;
  return state;
};

const UPDATE = (_state: WorkflowState, action: { payload: WorkflowState }) => action.payload;
const RESET = () => initialWorkflowState;

const reducers = {
  UPDATE_WORKFLOW_CHART,
  UPDATE_WORKFLOW_FILTER,
  UPDATE_WORKFLOW_NAME,
  UPDATE_WORKFLOW_ERROR,
  UPDATE_WORKFLOW_TIMESTAMP,
  UPDATE_WORKFLOW_UPDATEDBY,
  UPDATE,
  RESET,
};

export const WorkflowStore = createSlice({
  name: 'WORKFLOW',
  reducers,
  initialState: initialWorkflowState,
});

export const WorkflowStoreActions = WorkflowStore.actions;

export default WorkflowStore;
