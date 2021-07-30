import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const ConfigurationStore = createSlice({
  name: 'CONFIGURATION',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default ConfigurationStore;
