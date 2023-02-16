import appResourceController from '../../controllers/AppResource';
import AppResourcesStore from '../AppResourcesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppResourcesRequest = getRequestFactory(AppResourcesStore, appResourceController);
export const createAppResourceRequest = createRequestFactory(
  AppResourcesStore,
  appResourceController,
);
export const deleteAppResourceRequest = deleteRequestFactory(
  AppResourcesStore,
  appResourceController,
);
export const updateAppResourceRequest = updateRequestFactory(
  AppResourcesStore,
  appResourceController,
);
