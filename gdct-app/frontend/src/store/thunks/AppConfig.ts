import appConfigController from '../../controllers/AppConfig';
import AppConfigsStore from '../AppConfigsStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppConfigsRequest = getRequestFactory(AppConfigsStore, appConfigController);
export const createAppConfigRequest = createRequestFactory(AppConfigsStore, appConfigController);
export const deleteAppConfigRequest = deleteRequestFactory(AppConfigsStore, appConfigController);
export const updateAppConfigRequest = updateRequestFactory(AppConfigsStore, appConfigController);
