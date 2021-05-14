import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const AppRoleResourcesStore = createSlice({
  name: 'APP_ROLE_RESOURCE',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default AppRoleResourcesStore;
