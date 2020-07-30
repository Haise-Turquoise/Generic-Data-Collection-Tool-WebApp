import { createSlice } from '@reduxjs/toolkit';
import { REST_STATE } from '../common/REST/state';
import { REST_REDUCERS } from '../common/REST/reducers';

export const SubmissionNoteHistoryStore = createSlice({
  name: 'SUBMISSIONNOTEHISTORY',
  initialState: REST_STATE,
  reducers: REST_REDUCERS,
});

export default SubmissionNoteHistoryStore;
