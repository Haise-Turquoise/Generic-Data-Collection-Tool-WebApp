import appSysRoleController from '../../controllers/AppSysRole';
import AppSysRolesStore from '../AppSysRolesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

export const getAppSysRolesRequest = getRequestFactory(AppSysRolesStore, appSysRoleController);
export const createAppSysRoleRequest = createRequestFactory(AppSysRolesStore, appSysRoleController);
export const deleteAppSysRoleRequest = deleteRequestFactory(AppSysRolesStore, appSysRoleController);
export const updateAppSysRoleRequest = updateRequestFactory(AppSysRolesStore, appSysRoleController);
