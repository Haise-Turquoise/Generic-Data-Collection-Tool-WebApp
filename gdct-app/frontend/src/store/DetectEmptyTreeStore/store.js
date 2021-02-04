import { createSlice } from '@reduxjs/toolkit';
import { REST_REDUCERS } from '../common/REST/reducers';
import { REST_STATE } from '../common/REST/state';

export const DetectEmptyTreeStore = createSlice({
  name: 'DETECT_EMPTY_TREE',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default DetectEmptyTreeStore;
