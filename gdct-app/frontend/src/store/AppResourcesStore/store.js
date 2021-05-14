import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const AppResourcesStore = createSlice({
  name: 'APP_RESOURCES',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default AppResourcesStore;
