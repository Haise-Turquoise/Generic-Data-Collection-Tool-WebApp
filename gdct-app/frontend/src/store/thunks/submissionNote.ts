import { Dispatch } from 'redux';
import submissionNoteController from '../../controllers/submissionNote';
import SubmissionNoteHistoryStore from '../SubmissionNoteHistoryStore/store';

export const getSubmissionNoteRequest = (submissionId: string) => (dispatch: Dispatch) => {
  dispatch(SubmissionNoteHistoryStore.actions.REQUEST(''));

  submissionNoteController
    .fetchBySubmissionId(submissionId)
    .then(values => {
      dispatch(SubmissionNoteHistoryStore.actions.RECEIVE(values));
    })
    .catch(error => {
      dispatch(SubmissionNoteHistoryStore.actions.FAIL_REQUEST(error));
    });
};
