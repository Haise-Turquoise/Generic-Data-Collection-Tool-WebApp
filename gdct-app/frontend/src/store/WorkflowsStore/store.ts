import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const WorkflowsStore = createSlice({
  name: 'WORKFLOW',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default WorkflowsStore;
