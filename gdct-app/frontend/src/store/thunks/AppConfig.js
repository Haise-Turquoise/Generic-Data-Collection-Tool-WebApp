import appConfigController from '../../controllers/AppConfig';
import AppConfigsStore from '../AppConfigsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppConfigsRequest = getRequestFactory(AppConfigsStore, appSysController);
export const createAppConfigRequest = createRequestFactory(AppConfigsStore, appSysController);
export const deleteAppConfigRequest = deleteRequestFactory(AppConfigsStore, appSysController);
export const updateAppConfigRequest = updateRequestFactory(AppConfigsStore, appSysController);
