import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const ModifyUserInfoStore = createSlice({
  name: 'MODIFY_USER_INFO',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export const ModifyUserInfoStoreActions = ModifyUserInfoStore.actions;

export default ModifyUserInfoStore;
