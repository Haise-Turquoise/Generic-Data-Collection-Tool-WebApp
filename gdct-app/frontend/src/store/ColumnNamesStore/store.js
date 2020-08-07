import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const ColumnNamesStore = createSlice({
  name: 'COLUMN_NAMES',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export const ColumnNamesActions = ColumnNamesStore.actions;

export default ColumnNamesStore;
