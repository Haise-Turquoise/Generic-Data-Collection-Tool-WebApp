import reportingPeriodController from '../../controllers/reportingPeriod';
import ReportingPeriodsStore from '../ReportingPeriodsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getReportingPeriodsRequest = getRequestFactory(
  ReportingPeriodsStore,
  reportingPeriodController,
);
export const createReportingPeriodRequest = createRequestFactory(
  ReportingPeriodsStore,
  reportingPeriodController,
);
export const deleteReportingPeriodRequest = deleteRequestFactory(
  ReportingPeriodsStore,
  reportingPeriodController,
);
export const updateReportingPeriodRequest = updateRequestFactory(
  ReportingPeriodsStore,
  reportingPeriodController,
);
