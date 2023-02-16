import appRoleController from '../../controllers/AppRole';
import AppRolesStore from '../AppRolesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppRolesRequest = getRequestFactory(AppRolesStore, appRoleController);
export const createAppRoleRequest = createRequestFactory(AppRolesStore, appRoleController);
export const deleteAppRoleRequest = deleteRequestFactory(AppRolesStore, appRoleController);
export const updateAppRoleRequest = updateRequestFactory(AppRolesStore, appRoleController);
