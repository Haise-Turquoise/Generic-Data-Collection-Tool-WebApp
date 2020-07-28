import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const UsersStore = createSlice({
  name: 'USERS',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default UsersStore;
