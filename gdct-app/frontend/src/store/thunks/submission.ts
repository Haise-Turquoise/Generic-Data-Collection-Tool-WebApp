import submissionController from '../../controllers/submission';
import AuthController from '../../controllers/Auth';
import SubmissionsStore from '../SubmissionsStore/store';

import { deleteRequestFactory, updateRequestFactory } from './common/REST';
//@ts-ignore
import { extractReactAndWorkbookState } from '../../tools/excel';
import { Dispatch } from 'redux';
import SubmissionNote from '../../types/submissionnote';
import Submission from '../../types/submission';
import { state } from '../types';

export const getSubmissionsRequest = (callback: () => void) => (dispatch: Dispatch) => {
  dispatch(SubmissionsStore.actions.REQUEST(''));

  AuthController.profile().then(profile => {
    submissionController
      .fetchAndCreate(profile.data.email)
      .then(values => {
        dispatch(SubmissionsStore.actions.RECEIVE(values));
        callback();
      })
      .catch(error => {
        dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
        callback();
      });
  });
};

export const updateWorkbookRequest = (
  submissionNote: SubmissionNote,
  workbookData: Submission["workbookData"],
  submission: Submission,
  submitId: string,
) => (dispatch: Dispatch) => {
  dispatch(SubmissionsStore.actions.REQUEST(''));
  const newSubmission = {
    ...submission,
    workbookData,
  };

  submissionController
    .updateWorkbook(newSubmission, submissionNote)
    .then(value => {
      dispatch(SubmissionsStore.actions.CREATE(value));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

// export const createSubmissionRequest = createRequestFactory(
//   SubmissionsStore,
//   submissionController
// )
//@ts-ignore
export const deleteSubmissionRequest = deleteRequestFactory(SubmissionsStore, submissionController);
//@ts-ignore
export const updateSubmissionRequest = updateRequestFactory(SubmissionsStore, submissionController);

// Similar to submission
export const getSubmissionRequest = (_id: string) => (dispatch: Dispatch) => {
  dispatch(SubmissionsStore.actions.REQUEST(''));

  submissionController
    .fetchSubmission(_id)
    .then(submission => {
      // dispatch(setExcelData(convertStateToReactState(submission.workbookData)));
      //@ts-ignore not sure about this
      dispatch(submission.workbookData);
      dispatch(SubmissionsStore.actions.RECEIVE([submission]));
      //@ts-ignore
      dispatch();
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

export const updateSubmissionExcelRequest = () => (dispatch: Dispatch, getState: () => state) => {
  // dispatch(requestSubmissions())

  const {
    SubmissionsStore: {
      //@ts-ignore how do we get this
      response: { Values },
    },
    ui: {
      //@ts-ignore how do we get this
      excel: { present },
    },
  } = getState();

  const [submission] = Values;

  const newSubmission = {
    ...submission,
    //   name: present.name,
    isLatest: true,
    workbookData: extractReactAndWorkbookState(present, present.inactiveSheets),
  };

  submissionController
     //@ts-ignore
    .updateWorkbook(newSubmission)
    .then(() => {
      dispatch(SubmissionsStore.actions.UPDATE(newSubmission));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

export const getSubmissionByIdRequest = (_id: string) => (dispatch: Dispatch) => {
  submissionController
    .fetchSubmission(_id)
    .then(submission => {
      dispatch(SubmissionsStore.actions.RECEIVE(submission));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

export const updateSubmissionStatusRequest = (
  submission: Submission,
  submissionNote: SubmissionNote,
  role: SubmissionNote["role"],
  newProcessId: string
) => async (dispatch: Dispatch) => {
  const updatedBy = localStorage.getItem('currentUser') || '';

  await submissionController
    .updateStatus(submission, submissionNote, role, newProcessId, updatedBy)
    .then((updatedSubmission) => {
      Object.assign(updatedSubmission, {phase: role});
      dispatch(SubmissionsStore.actions.RECEIVE(updatedSubmission));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
  return true;
};
