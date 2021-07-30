import submissionPeriodController from '../../controllers/submissionPeriod';
import SubmissionPeriodsStore from '../SubmissionPeriodsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getSubmissionPeriodsRequest = getRequestFactory(
  SubmissionPeriodsStore,
  submissionPeriodController,
);
export const createSubmissionPeriodRequest = createRequestFactory(
  SubmissionPeriodsStore,
  submissionPeriodController,
);
export const deleteSubmissionPeriodRequest = deleteRequestFactory(
  SubmissionPeriodsStore,
  submissionPeriodController,
);
export const updateSubmissionPeriodRequest = updateRequestFactory(
  SubmissionPeriodsStore,
  submissionPeriodController,
);
