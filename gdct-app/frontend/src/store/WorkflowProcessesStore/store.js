import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const WorkflowProcessesStore = createSlice({
  name: 'WORKFLOW_PROCESSES',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default WorkflowProcessesStore;
