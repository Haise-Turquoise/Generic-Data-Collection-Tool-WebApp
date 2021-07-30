import statusController from '../../controllers/status';
import StatusesStore from '../StatusesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getStatusesRequest = getRequestFactory(StatusesStore, statusController);
export const createStatusRequest = createRequestFactory(StatusesStore, statusController);
export const deleteStatusRequest = deleteRequestFactory(StatusesStore, statusController);
export const updateStatusRequest = updateRequestFactory(StatusesStore, statusController);
