import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const OrganizationGroupStore = createSlice({
  name: 'ORGANIZATIONGROUP',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});
  
export default OrganizationGroupStore;
