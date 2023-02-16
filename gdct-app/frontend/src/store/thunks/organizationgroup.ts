import orgGroupController from '../../controllers/organizationGroup';
import OrgGroupStore from '../OrganizationGroupStore/store';
import columnNameController from '../../controllers/organization';
import ColumnNamesStore from '../ColumnNamesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

const getOrgGroupRequest = getRequestFactory(OrgGroupStore, orgGroupController);
// const createOrgGroupRequest = createRequestFactory(OrgGroupStore, orgGroupController);
// const deleteOrgGroupRequest = deleteRequestFactory(OrgGroupStore, orgGroupController);
// const updateOrgGroupRequest = updateRequestFactory(OrgGroupStore, orgGroupController);

//const getColumnNamesRequest = getRequestFactory(ColumnNamesStore, columnNameController);
// const createColumnNameRequest = createRequestFactory(ColumnNamesStore, columnNameController);
// const deleteColumnNameRequest = deleteRequestFactory(ColumnNamesStore, columnNameController);
// const updateColumnNameRequest = updateRequestFactory(ColumnNamesStore, columnNameController);

export {
  getOrgGroupRequest
  // ,
  // getColumnNamesRequest,
  // createColumnNameRequest,
  // deleteColumnNameRequest,
  // updateColumnNameRequest,
};