import appSysController from '../../controllers/AppSys';
import AppSysesStore from '../AppSysesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppSysesRequest = getRequestFactory(AppSysesStore, appSysController);
export const createAppSysRequest = createRequestFactory(AppSysesStore, appSysController);
export const deleteAppSysRequest = deleteRequestFactory(AppSysesStore, appSysController);
export const updateAppSysRequest = updateRequestFactory(AppSysesStore, appSysController);
