import organizationGroupController from '../../controllers/organizationGroup';
import OrganizationGroupStore from '../OrganizationGroupStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';
export const getOrganizationGroupRequest = getRequestFactory(OrganizationGroupStore, organizationGroupController);
export const createOrganizationGroupRequest = createRequestFactory(OrganizationGroupStore, organizationGroupController);
export const deleteOrganizationGroupRequest = deleteRequestFactory(OrganizationGroupStore, organizationGroupController);
export const updateOrganizationGroupRequest = updateRequestFactory(OrganizationGroupStore, organizationGroupController);
