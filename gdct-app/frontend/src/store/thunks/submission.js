import submissionController from '../../controllers/submission';
import AuthController from '../../controllers/Auth';
import SubmissionsStore from '../SubmissionsStore/store';

import {
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';
import { extractReactAndWorkbookState } from '../../tools/excel';

export const getSubmissionsRequest = () => dispatch => {
  dispatch(SubmissionsStore.actions.REQUEST());

  AuthController.profile().then(profile => {
    submissionController
      .fetchAndCreate(profile.data.email)
      .then(values => {
        dispatch(SubmissionsStore.actions.RECEIVE(values));
      })
      .catch(error => {
        dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
      });
  });
};

export const updateWorkbookRequest = (
  submissionNote,
  workbookData,
  submission,
  submitId,
) => dispatch => {
  dispatch(SubmissionsStore.actions.REQUEST());
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
export const deleteSubmissionRequest = deleteRequestFactory(SubmissionsStore, submissionController);
export const updateSubmissionRequest = updateRequestFactory(SubmissionsStore, submissionController);

// Similar to submission
export const getSubmissionRequest = _id => dispatch => {
  dispatch(SubmissionsStore.actions.REQUEST());

  submissionController
    .fetchSubmission(_id)
    .then(submission => {
      // dispatch(setExcelData(convertStateToReactState(submission.workbookData)));
      dispatch(submission.workbookData);
      dispatch(SubmissionsStore.actions.RECEIVE([submission]));
      dispatch();
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

export const updateSubmissionExcelRequest = () => (dispatch, getState) => {
  // dispatch(requestSubmissions())

  const {
    SubmissionsStore: {
      response: { Values },
    },
    ui: {
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
    .updateWorkbook(newSubmission)
    .then(() => {
      dispatch(SubmissionsStore.actions.UPDATE(newSubmission));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

export const getSubmissionByIdRequest = _id => dispatch => {
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
  submission,
  submissionNote,
  role,
  newProcessId,
) => async dispatch => {

  const updatedBy = localStorage.getItem('currentUser');

  const newSubmission = {
    ...submission,
    //   name: present.name,
    phase: role,
  };

  await submissionController

    .updateStatus(submission, submissionNote, role, newProcessId, updatedBy)
    .then(() => {
      // console.log(submission);

      dispatch(SubmissionsStore.actions.UPDATE(newSubmission));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
  return true;
};

