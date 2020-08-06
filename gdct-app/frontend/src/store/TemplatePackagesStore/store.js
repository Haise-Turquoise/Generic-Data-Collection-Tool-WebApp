import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const TemplatePackagesStore = createSlice({
  name: 'TEMPLATE_PACKAGES',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export const TemplatePackagesStoreActions = TemplatePackagesStore.actions;

export default TemplatePackagesStore;
