import { createSlice } from '@reduxjs/toolkit';

export const defaultChart = {
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

export const initialWorkflowState = {
  chart: defaultChart,
  filter: '',
  name: '',
  error: null,
  _id: null,
  timestamp: Date.now,
  updatedBy: localStorage.getItem('currentUser'),
};

const UPDATE_WORKFLOW_CHART = (state, action) => {
  const chart = action.payload(state.chart);

  state.chart = chart;

  return state;
};

const UPDATE_WORKFLOW_FILTER = (state, action) => {
  state.filter = action.payload;
  return state;
};

const UPDATE_WORKFLOW_NAME = (state, action) => {
  state.name = action.payload;
  return state;
};

const UPDATE_WORKFLOW_ERROR = (state, action) => {
  state.ERROR = action.payload;
  return state;
};

const UPDATE_WORKFLOW_TIMESTAMP = (state, action) => {
  state.timestamp = action.payload;
  return state;
};

const UPDATE_WORKFLOW_UPDATEDBY = (state, action) => {
  state.updatedBy = action.payload;
  return state;
};

const UPDATE = (_state, action) => action.payload;
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
