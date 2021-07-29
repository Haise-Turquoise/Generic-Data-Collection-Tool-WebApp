import appRoleResourceController from '../../controllers/AppRoleResource';
import AppRoleResourcesStore from '../AppRoleResourcesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppRoleResourcesRequest = getRequestFactory(
  AppRoleResourcesStore,
  appRoleResourceController,
);
export const createAppRoleResourceRequest = createRequestFactory(
  AppRoleResourcesStore,
  appRoleResourceController,
);
export const deleteAppRoleResourceRequest = deleteRequestFactory(
  AppRoleResourcesStore,
  appRoleResourceController,
);
export const updateAppRoleResourceRequest = updateRequestFactory(
  AppRoleResourcesStore,
  appRoleResourceController,
);
