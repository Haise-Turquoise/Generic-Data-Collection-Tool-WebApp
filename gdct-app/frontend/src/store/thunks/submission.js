import submissionController from '../../controllers/submission';
import SubmissionsStore from '../SubmissionsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';
import { convertStateToReactState, extractReactAndWorkbookState } from '../../tools/excel';
import { setExcelData } from '../actions/ui/excel/commands';

export const getSubmissionsRequest = (orgId, programIds) => dispatch => {
  dispatch(SubmissionsStore.actions.REQUEST());

  submissionController
    .fetchAndCreate(orgId, programIds)
    .then(values => {
      dispatch(SubmissionsStore.actions.RECEIVE(values));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};

export const createSubmissionRequest = (
  submissionNote,
  workbookData,
  submission,
  submitId,
) => dispatch => {
  console.log(submitId);
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
      dispatch(setExcelData(convertStateToReactState(submission.workbookData)));
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
    .update(newSubmission)
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
) => dispatch => {
  const newSubmission = {
    ...submission,
    //   name: present.name,
    phase: role,
  };
  submissionController
    .updateStatus(submission, submissionNote, role, newProcessId)
    .then(() => {
      dispatch(SubmissionsStore.actions.UPDATE(newSubmission));
    })
    .catch(error => {
      dispatch(SubmissionsStore.actions.FAIL_REQUEST(error));
    });
};
