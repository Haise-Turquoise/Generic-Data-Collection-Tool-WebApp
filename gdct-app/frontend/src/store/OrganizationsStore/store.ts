import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

const OrgsStore = createSlice({
  name: 'ORGANIZATIONS',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default OrgsStore;
