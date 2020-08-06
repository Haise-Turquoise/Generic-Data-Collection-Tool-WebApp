import orgController from '../../controllers/organization';
import OrgsStore from '../OrganizationsStore/store';
import columnNameController from '../../controllers/organization';
import ColumnNamesStore from '../ColumnNamesStore/store';

import {
  getRequestFactory,
  createRequestFactory,
  deleteRequestFactory,
  updateRequestFactory,
} from './common/REST';

const getOrgsRequest = getRequestFactory(OrgsStore, orgController);
const createOrgsRequest = createRequestFactory(OrgsStore, orgController);
const deleteOrgsRequest = deleteRequestFactory(OrgsStore, orgController);
const updateOrgsRequest = updateRequestFactory(OrgsStore, orgController);

const getColumnNamesRequest = getRequestFactory(ColumnNamesStore, columnNameController);
const createColumnNameRequest = createRequestFactory(ColumnNamesStore, columnNameController);
const deleteColumnNameRequest = deleteRequestFactory(ColumnNamesStore, columnNameController);
const updateColumnNameRequest = updateRequestFactory(ColumnNamesStore, columnNameController);

export {
  getOrgsRequest,
  createOrgsRequest,
  deleteOrgsRequest,
  updateOrgsRequest,
  getColumnNamesRequest,
  createColumnNameRequest,
  deleteColumnNameRequest,
  updateColumnNameRequest,
};
