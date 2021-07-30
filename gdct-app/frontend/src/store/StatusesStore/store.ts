import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const StatusesStore = createSlice({
  name: 'STATUSES',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export const StatusesStoreActions = StatusesStore.actions;

export default StatusesStore;
